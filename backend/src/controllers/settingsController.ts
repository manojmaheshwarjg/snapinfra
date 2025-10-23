import { Request, Response } from 'express';
import { DynamoDBService } from '@/services/database/dynamoDBService';
import { S3Service } from '@/services/storage/s3Service';
import { settingsSchema } from '@/validation/schemas';
import { v4 as uuidv4 } from 'uuid';
import { Settings } from '@/models';

const dynamoDB = new DynamoDBService();
const s3Service = new S3Service();

export const getSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const settings = await dynamoDB.get('Settings', { userId });
    
    if (!settings) {
      const defaultSettings: Settings = {
        id: uuidv4(),
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        theme: 'system',
        notifications: {
          email: true,
          push: true,
          slack: false,
          deploymentAlerts: true,
          errorAlerts: true
        },
        integrations: {},
        preferences: {}
      };
      
      await dynamoDB.put('Settings', defaultSettings);
      return res.json({ settings: defaultSettings });
    }

    res.json({ settings });
  } catch (error) {
    console.error('Error in getSettings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const { error, value } = settingsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let settings = await dynamoDB.get('Settings', { userId });

    if (!settings) {
      settings = {
        id: uuidv4(),
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        theme: 'system',
        notifications: {
          email: true,
          push: true,
          slack: false,
          deploymentAlerts: true,
          errorAlerts: true
        },
        integrations: {},
        preferences: {}
      };
    }

    settings = {
      ...settings,
      ...value,
      updatedAt: new Date().toISOString()
    };

    await dynamoDB.put('Settings', settings);
    res.json({ settings });
  } catch (error) {
    console.error('Error in updateSettings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

export const updateTheme = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { theme } = req.body;

    if (!['light', 'dark', 'system'].includes(theme)) {
      return res.status(400).json({ error: 'Invalid theme value' });
    }

    let settings = await dynamoDB.get('Settings', { userId });
    if (!settings) {
      settings = await createDefaultSettings(userId);
    }

    settings.theme = theme;
    settings.updatedAt = new Date().toISOString();

    await dynamoDB.put('Settings', settings);
    res.json({ settings });
  } catch (error) {
    console.error('Error in updateTheme:', error);
    res.status(500).json({ error: 'Failed to update theme' });
  }
};

export const updateNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    let settings = await dynamoDB.get('Settings', { userId });
    if (!settings) {
      settings = await createDefaultSettings(userId);
    }

    settings.notifications = {
      ...settings.notifications,
      ...req.body
    };
    settings.updatedAt = new Date().toISOString();

    await dynamoDB.put('Settings', settings);
    res.json({ settings });
  } catch (error) {
    console.error('Error in updateNotifications:', error);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
};

export const updateIntegrations = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    let settings = await dynamoDB.get('Settings', { userId });
    if (!settings) {
      settings = await createDefaultSettings(userId);
    }

    settings.integrations = {
      ...settings.integrations,
      ...req.body
    };
    settings.updatedAt = new Date().toISOString();

    await dynamoDB.put('Settings', settings);
    res.json({ settings });
  } catch (error) {
    console.error('Error in updateIntegrations:', error);
    res.status(500).json({ error: 'Failed to update integrations' });
  }
};

export const resetSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const defaultSettings = await createDefaultSettings(userId);
    await dynamoDB.put('Settings', defaultSettings);

    res.json({ settings: defaultSettings, message: 'Settings reset successfully' });
  } catch (error) {
    console.error('Error in resetSettings:', error);
    res.status(500).json({ error: 'Failed to reset settings' });
  }
};

async function createDefaultSettings(userId: string): Promise<Settings> {
  return {
    id: uuidv4(),
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    theme: 'system',
    notifications: {
      email: true,
      push: true,
      slack: false,
      deploymentAlerts: true,
      errorAlerts: true
    },
    integrations: {},
    preferences: {}
  };
}

export const uploadProfilePicture = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { imageData, contentType } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'imageData is required' });
    }

    let settings = await dynamoDB.get('Settings', { userId });
    if (!settings) {
      settings = await createDefaultSettings(userId);
    }

    if (settings.profilePictureKey) {
      await s3Service.deleteFile(settings.profilePictureKey);
    }

    const buffer = Buffer.from(imageData, 'base64');
    const key = `profile-pictures/${userId}/${Date.now()}.${contentType?.split('/')[1] || 'png'}`;
    
    const fileMetadata = await s3Service.uploadFile(key, buffer, {
      contentType: contentType || 'image/png',
      metadata: { userId },
      acl: 'private'
    });

    settings.profilePictureKey = fileMetadata.key;
    settings.profilePictureUrl = fileMetadata.url;
    settings.updatedAt = new Date().toISOString();

    await dynamoDB.put('Settings', settings);

    const presignedUrl = await s3Service.generatePresignedUrl(fileMetadata.key, 86400);

    res.json({ 
      message: 'Profile picture uploaded successfully',
      profilePictureUrl: presignedUrl
    });
  } catch (error) {
    console.error('Error in uploadProfilePicture:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
};

export const getProfilePictureUrl = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const settings = await dynamoDB.get('Settings', { userId });
    if (!settings || !settings.profilePictureKey) {
      return res.status(404).json({ error: 'Profile picture not found' });
    }

    const presignedUrl = await s3Service.generatePresignedUrl(settings.profilePictureKey, 86400);

    res.json({ url: presignedUrl });
  } catch (error) {
    console.error('Error in getProfilePictureUrl:', error);
    res.status(500).json({ error: 'Failed to get profile picture URL' });
  }
};

export const deleteProfilePicture = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const settings = await dynamoDB.get('Settings', { userId });
    if (!settings || !settings.profilePictureKey) {
      return res.status(404).json({ error: 'Profile picture not found' });
    }

    await s3Service.deleteFile(settings.profilePictureKey);

    delete settings.profilePictureKey;
    delete settings.profilePictureUrl;
    settings.updatedAt = new Date().toISOString();

    await dynamoDB.put('Settings', settings);

    res.json({ message: 'Profile picture deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProfilePicture:', error);
    res.status(500).json({ error: 'Failed to delete profile picture' });
  }
};
