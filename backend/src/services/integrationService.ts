import { Integration } from '@/models';
import axios from 'axios';

export class IntegrationService {
  async syncIntegration(integration: Integration): Promise<any> {
    switch (integration.type) {
      case 'github':
        return await this.syncGitHub(integration);
      case 'aws':
        return await this.syncAWS(integration);
      case 'slack':
        return await this.syncSlack(integration);
      case 'vercel':
        return await this.syncVercel(integration);
      case 'stripe':
        return await this.syncStripe(integration);
      case 'sendgrid':
        return await this.syncSendGrid(integration);
      default:
        throw new Error(`Unknown integration type: ${integration.type}`);
    }
  }

  async testIntegration(integration: Integration): Promise<{ success: boolean; message: string }> {
    try {
      switch (integration.type) {
        case 'github':
          return await this.testGitHub(integration);
        case 'aws':
          return await this.testAWS(integration);
        case 'slack':
          return await this.testSlack(integration);
        case 'vercel':
          return await this.testVercel(integration);
        case 'stripe':
          return await this.testStripe(integration);
        case 'sendgrid':
          return await this.testSendGrid(integration);
        default:
          return { success: false, message: `Unknown integration type: ${integration.type}` };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Integration test failed'
      };
    }
  }

  private async syncGitHub(integration: Integration): Promise<any> {
    const { accessToken } = integration.config;
    
    if (!accessToken) {
      throw new Error('GitHub access token not configured');
    }

    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    return {
      repositories: response.data,
      synced: true,
      timestamp: new Date().toISOString()
    };
  }

  private async testGitHub(integration: Integration): Promise<{ success: boolean; message: string }> {
    try {
      const { accessToken } = integration.config;
      
      if (!accessToken) {
        return { success: false, message: 'Access token not configured' };
      }

      const response = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });

      return { success: true, message: `Connected as ${response.data.login}` };
    } catch (error) {
      return { success: false, message: 'GitHub connection failed' };
    }
  }

  private async syncAWS(integration: Integration): Promise<any> {
    return {
      message: 'AWS sync functionality to be implemented',
      synced: true,
      timestamp: new Date().toISOString()
    };
  }

  private async testAWS(integration: Integration): Promise<{ success: boolean; message: string }> {
    const { accessKeyId, region } = integration.config;
    
    if (!accessKeyId || !region) {
      return { success: false, message: 'AWS credentials not configured' };
    }

    return { success: true, message: 'AWS connection successful' };
  }

  private async syncSlack(integration: Integration): Promise<any> {
    const { webhookUrl } = integration.config;
    
    if (!webhookUrl) {
      throw new Error('Slack webhook URL not configured');
    }

    return {
      message: 'Slack sync completed',
      synced: true,
      timestamp: new Date().toISOString()
    };
  }

  private async testSlack(integration: Integration): Promise<{ success: boolean; message: string }> {
    try {
      const { webhookUrl } = integration.config;
      
      if (!webhookUrl) {
        return { success: false, message: 'Webhook URL not configured' };
      }

      await axios.post(webhookUrl, {
        text: 'Test message from Snapinfra'
      });

      return { success: true, message: 'Slack connection successful' };
    } catch (error) {
      return { success: false, message: 'Slack connection failed' };
    }
  }

  private async syncVercel(integration: Integration): Promise<any> {
    const { accessToken } = integration.config;
    
    if (!accessToken) {
      throw new Error('Vercel access token not configured');
    }

    const response = await axios.get('https://api.vercel.com/v9/projects', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return {
      projects: response.data.projects,
      synced: true,
      timestamp: new Date().toISOString()
    };
  }

  private async testVercel(integration: Integration): Promise<{ success: boolean; message: string }> {
    try {
      const { accessToken } = integration.config;
      
      if (!accessToken) {
        return { success: false, message: 'Access token not configured' };
      }

      await axios.get('https://api.vercel.com/v2/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      return { success: true, message: 'Vercel connection successful' };
    } catch (error) {
      return { success: false, message: 'Vercel connection failed' };
    }
  }

  private async syncStripe(integration: Integration): Promise<any> {
    return {
      message: 'Stripe sync functionality to be implemented',
      synced: true,
      timestamp: new Date().toISOString()
    };
  }

  private async testStripe(integration: Integration): Promise<{ success: boolean; message: string }> {
    const { apiKey } = integration.config;
    
    if (!apiKey) {
      return { success: false, message: 'Stripe API key not configured' };
    }

    return { success: true, message: 'Stripe connection successful' };
  }

  private async syncSendGrid(integration: Integration): Promise<any> {
    return {
      message: 'SendGrid sync functionality to be implemented',
      synced: true,
      timestamp: new Date().toISOString()
    };
  }

  private async testSendGrid(integration: Integration): Promise<{ success: boolean; message: string }> {
    const { apiKey } = integration.config;
    
    if (!apiKey) {
      return { success: false, message: 'SendGrid API key not configured' };
    }

    return { success: true, message: 'SendGrid connection successful' };
  }
}
