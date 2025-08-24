import axios from 'axios';

export class DifyClient {
  constructor(apiUrl, apiKey, appToken, appPass) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.appToken = appToken;
    this.appPass = appPass;
    
    this.axiosInstance = axios.create({
      baseURL: apiUrl,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async chatCompletion(message, user = 'default-user', conversationId = null) {
    try {
      const payload = {
        inputs: {pass: this.appPass},
        query: message,
        response_mode: 'blocking',
        user: user,
      };

      if (conversationId) {
        payload.conversation_id = conversationId;
      }

      const response = await this.axiosInstance.post('/chat-messages', payload);

      return {
        success: true,
        data: response.data,
        message: response.data.answer,
        conversationId: response.data.conversation_id,
      };
    } catch (error) {
      console.error('Dify API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async getConversationHistory(conversationId, user = 'default-user') {
    try {
      const response = await this.axiosInstance.get('/messages', {
        params: {
          conversation_id: conversationId,
          user: user,
        },
        headers: {
          'Authorization': `Bearer ${this.appToken}`,
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Dify API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }
}