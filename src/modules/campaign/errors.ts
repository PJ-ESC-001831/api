export class CampaignNotFoundError extends Error {
  constructor(message = 'Campaign not found.') {
    super(message);
    this.name = 'CampaignNotFoundError';
  }
}

export class FailedToCreateCampaignError extends Error {
  constructor(message = 'Failed to create campaign.') {
    super(message);
    this.name = 'FailedToCreateCampaignError';
  }
}

export class FailedToUpdateCampaignError extends Error {
  constructor(message = 'Failed to update campaign.') {
    super(message);
    this.name = 'FailedToUpdateCampaignError';
  }
}

export class FailedToAddImageToCampaignError extends Error {
  constructor(message = 'Failed to add an image to the campaign.') {
    super(message);
    this.name = 'FailedToAddImageToCampaignError';
  }
}

export class NewBucketError extends Error {
  constructor(
    message = 'You were trying to use a bucket that is not yet created. Please retry the request.',
  ) {
    super(message);
    this.name = 'NewBucketError';
  }
}
