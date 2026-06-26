// Netlify Serverless Function - AI答疑
// 这个函数运行在Netlify服务器上，API Key安全地存在环境变量中

exports.handler = async function(event) {
    
    // 处理OPTIONS预检请求
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            }
        };
    }
    
    // 只接受POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ success: false, error: '只支持POST请求' })
        };
    }
    
    try {
        // 解析请求
        var body = JSON.parse(event.body);
        var question = body.question;
        
        if (!question) {
            return {
                statusCode: 400,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ success: false, error: '请输入问题' })
            };
        }
        
        // 调用通义千问API
        // API Key从Netlify环境变量中读取，不会暴露给前端
        var fetch = require('node-fetch');
        
        var response = await fetch(
            'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + process.env.AI_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'qwen-turbo',
                    input: {
                        messages: [
                            {
                                role: 'system',
                                content: '你是一个友好的编程老师小智，用小朋友能听懂的话回答问题，语气温柔可爱。回答要简单明了，多用比喻。'
                            },
                            {
                                role: 'user',
                                content: question
                            }
                        ]
                    },
                    parameters: {
                        result_format: 'message'
                    }
                })
            }
        );
        
        var data = await response.json();
        
        // 提取回答
        if (data.output && data.output.choices && data.output.choices[0] && data.output.choices[0].message) {
            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({
                    success: true,
                    answer: data.output.choices[0].message.content
                })
            };
        } else {
            throw new Error('API返回格式异常：' + JSON.stringify(data));
        }
        
    } catch (error) {
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
                success: false,
                error: 'AI服务调用失败：' + error.message
            })
        };
    }
};