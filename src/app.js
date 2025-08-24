import dotenv from 'dotenv';
import readline from 'readline';
import { DifyClient } from './dify-client.js';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class ChatApp {
  constructor() {
    this.difyClient = new DifyClient(
      process.env.DIFY_API_URL,
      process.env.DIFY_API_KEY,
      process.env.DIFY_APP_TOKEN,
      process.env.DIFY_APP_PASS
    );
    this.conversationId = null;
    this.user = 'console-user';
  }

  async start() {
    console.log('🤖 Dify チャットボットへようこそ！');
    console.log('💡 メッセージを入力してください (終了するには "exit" を入力)');
    console.log('-------------------------------------------');

    this.promptUser();
  }

  promptUser() {
    rl.question('あなた: ', async (message) => {
      if (message.toLowerCase() === 'exit') {
        console.log('👋 チャットを終了します。ありがとうございました！');
        rl.close();
        return;
      }

      if (message.trim() === '') {
        this.promptUser();
        return;
      }

      console.log('🤔 考え中...');

      try {
        const response = await this.difyClient.chatCompletion(
          message,
          this.user,
          this.conversationId
        );

        if (response.success) {
          console.log(`🤖 ボット: ${response.message}`);
          this.conversationId = response.conversationId;
        } else {
          console.log(`❌ エラーが発生しました: ${response.error}`);
        }
      } catch (error) {
        console.log(`❌ 予期しないエラーが発生しました: ${error.message}`);
      }

      console.log('-------------------------------------------');
      this.promptUser();
    });
  }

  async showHistory() {
    if (!this.conversationId) {
      console.log('📝 まだ会話履歴がありません。');
      return;
    }

    const history = await this.difyClient.getConversationHistory(
      this.conversationId,
      this.user
    );

    if (history.success) {
      console.log('📜 会話履歴:');
      console.log('-------------------------------------------');
      history.data.data.forEach((msg, index) => {
        console.log(`${index + 1}. ${msg.query}`);
        console.log(`   回答: ${msg.answer}`);
        console.log('');
      });
    } else {
      console.log(`❌ 履歴の取得に失敗しました: ${history.error}`);
    }
  }
}

function validateEnvironmentVariables() {
  const requiredVars = ['DIFY_API_URL', 'DIFY_API_KEY', 'DIFY_APP_TOKEN', 'DIFY_APP_PASS'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ 以下の環境変数が設定されていません:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('');
    console.error('💡 .envファイルを作成し、必要な値を設定してください。');
    console.error('   .env.exampleファイルを参考にしてください。');
    process.exit(1);
  }
}

async function main() {
  validateEnvironmentVariables();
  
  const app = new ChatApp();
  await app.start();
}

process.on('SIGINT', () => {
  console.log('\n👋 プログラムを終了します。');
  process.exit(0);
});

main().catch(error => {
  console.error('❌ アプリケーションの開始に失敗しました:', error.message);
  process.exit(1);
});