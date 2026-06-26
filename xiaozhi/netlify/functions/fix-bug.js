// Netlify Serverless Function - Bug诊断

exports.handler = async function(event) {
    
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
    
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ success: false, error: '只支持POST' })
        };
    }
    
    try {
        var body = JSON.parse(event.body);
        var question = body.question;
        
        if (!question) {
            return {
                statusCode: 400,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ success: false, error: '请输入代码' })
            };
        }
        
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
                                content: '你是一个温柔的编程老师，专门帮小朋友找出代码中的错误。用简单易懂的话解释问题在哪里，并给出修改后的正确代码。'
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
            throw new Error('API返回异常');
        }
        
    } catch (error) {
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
                success: false,
                error: '诊断失败：' + error.message
            })
        };
    }
};