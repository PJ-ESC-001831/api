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
