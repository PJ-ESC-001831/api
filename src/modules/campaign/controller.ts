import { NextFunction, Request, Response } from 'express';
import multer, { File as MulterFile } from 'multer';
import path from 'path';
import { getMinioClient } from '@modules/minio';
import { labeledLogger } from '@modules/logger';
import {
  createCampaign as createNewCampaign,
  getCampaignById,
  updateCampaign,
} from '.';

const logger = labeledLogger('module:campaign/controller');

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Set a higher file size limit (e.g., 10MB)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png') {
      cb(null, true); // Accept PNG files
    } else {
      cb(new Error('Only PNG files are allowed'), false);
    }
  },
});

/**
 * Retrieves campaign details based on the provided campaign ID, fetching the data from the database and returning it to the client, or sending a 404 response if the campaign is not found.
 * @param {Request} req The request object containing the campaign ID in the parameters.
 * @param {Response} res The response object used to send the response to the client.
 * @param {NextFunction} next The next middleware function in the stack for error handling.
 * @return {Promise<Response | void>} A promise that resolves to the campaign data or an error.
 */
export const getCampaign = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  logger.info(`Retrieving campaign details for id: ${req.params.id}`);

  try {
    const result = await getCampaignById(parseInt(req.params.id, 10));

    if (result === null) {
      return res.status(404).json({ error: 'Campaign not found.' });
    }

    return res.json({ data: result });
  } catch (error) {
    logger.error(`Failed to retrieve campaign details: ${error}`);
    next(error);
  }
};

/**
 * Creates a new campaign by saving the provided campaign data from the request body to the database and returning the newly created campaign ID to the client.
 * @param {Request} req The request object containing the campaign data in the body.
 * @param {Response} res The response object used to send the response to the client.
 * @param {NextFunction} next The next middleware function in the stack for error handling.
 * @return {Promise<Response | void>} A promise that resolves to the newly created campaign ID or an error.
 */
export const postCampaign = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const { ...campaignData } = req.body;

  try {
    const [{ id }] = await createNewCampaign(campaignData);

    return res.status(200).json({
      data: {
        id,
      },
    });
  } catch (error) {
    logger.error(`Failed to create campaign: ${error}`);
    next(error);
  }
};

/**
 * Updates a campaign identified by the provided campaign ID in the request parameters using the data in the request body, returning the updated campaign ID or a 404 response if the campaign is not found.
 * @param {Request} req The request object containing the campaign ID in the parameters and data in the body.
 * @param {Response} res The response object used to send the response to the client.
 * @param {NextFunction} next The next middleware function in the stack for error handling.
 * @return {Promise<Response | void>} A promise that resolves to the updated campaign ID or an error.
 */
export const patchCampaign = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const campaignId = req.params.id;
  const campaignData = req.body;

  try {
    const result = await updateCampaign(campaignId, campaignData);

    if (!result) {
      return res.status(404).json({ error: 'Campaign not found.' });
    }

    return res.status(200).json({
      data: {
        id: result.id,
      },
    });
  } catch (error) {
    logger.error(`Failed to update campaign: ${error}`);
    next(error);
  }
};

/**
 * Attaches images to a campaign by uploading them to MinIO under a structured path, saving metadata including image URLs and timestamps, and optionally storing the metadata in MinIO as a JSON file.
 * @param {Request} req The request object containing the campaign ID in the parameters and images in the files.
 * @param {Response} res The response object used to send the response to the client.
 * @param {NextFunction} next The next middleware function in the stack for error handling.
 * @return {Promise<Response | void>} A promise that resolves to the image metadata or an error.
 */
export const postCampaignImages = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  logger.info('Attaching images to a campaign.');

  const campaignId = req.params.id;

  if (!campaignId) {
    return res.status(400).json({ error: 'Campaign ID is required.' });
  }

  if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
    return res.status(400).json({ error: 'No files uploaded.' });
  }

  const bucketName = process.env.MINIO_BUCKET_NAME;

  if (!bucketName) {
    logger.error('Missing MINIO_BUCKET_NAME environment variable.');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  try {
    const files = Array.isArray(req.files) ? req.files : [req.files];
    const minioClient = getMinioClient();

    if (!minioClient) {
      logger.error('Failed to get an instance of the Minio client.');
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    // Validate and upload files to MinIO
    const uploadedFiles = await Promise.all(
      files.map(async (file: MulterFile) => {
        const allowedExtensions = ['.jpg', '.jpeg', '.png']; // Add more if needed
        const fileExtension = path.extname(file.originalname).toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
          throw new Error(`Unsupported file type: ${fileExtension}`);
        }

        const key = `${campaignId}/${Date.now()}${fileExtension}`;

        await minioClient.putObject(bucketName, key, file.buffer, file.size, {
          'Content-Type': file.mimetype,
        });

        return {
          url: `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT}/${bucketName}/${key}`,
          filename: key,
        };
      }),
    );

    // Construct metadata
    const metadata = {
      campaignId,
      images: uploadedFiles,
      uploadedAt: new Date().toISOString(),
    };

    // Save metadata to MinIO (optional)
    const metadataKey = `campaigns/${campaignId}/metadata.json`;

    await minioClient.putObject(
      bucketName,
      metadataKey,
      Buffer.from(JSON.stringify(metadata)),
      JSON.stringify(metadata).length,
      {
        'Content-Type': 'application/json',
      },
    );

    return res.status(200).json({
      message: 'Images attached to campaign successfully.',
      data: metadata,
    });
  } catch (error) {
    logger.error(`Failed to attach images to campaign: ${error}`);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    next(error);
  }
};

// Multer middleware for handling file uploads
// NOTE: This middleware is used in the routes file, the "images" here should match the field name in the form data.
export const uploadMiddleware = upload.array('images');
