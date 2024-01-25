const vea = {
    client_msg_id: 'e48ff784-9e5a-4648-ac98-17cc756f7364',
    type: 'message',
    text: 'Hello this message from vea',
    user: 'U06FLHN6W90',
    ts: '1706193687.659189',
    blocks: [{ type: 'rich_text', block_id: '4abUG', elements: [Array] }],
    team: 'T06FK2CCE84',
    channel: 'D06FZ6X4WBT',
    event_ts: '1706193687.659189',
    channel_type: 'im'
}
const usv = {
    client_msg_id: 'e1ac5569-d30a-45c3-9254-5659a8bb7195',
    type: 'message',
    text: 'hello this message from usv',
    user: 'U06G5BY5WRW',
    ts: '1706193738.517369',
    blocks: [{ type: 'rich_text', block_id: '7LDBw', elements: [Array] }],
    team: 'T06FK2CCE84',
    channel: 'D06FK2G7V36',
    event_ts: '1706193738.517369',
    channel_type: 'im'
}

const veabully = {
    client_msg_id: '7225a0b5-81fb-4cbc-8885-e346cdf9add5',
    type: 'message',
    text: 'this message from vea but from bully',
    user: 'U06FQFAUH4G',
    ts: '1706193790.082859',
    blocks: [{ type: 'rich_text', block_id: '3zF5v', elements: [Array] }],
    team: 'T06EYPYRU77',
    channel: 'D06FUQB1QAD',
    event_ts: '1706193790.082859',
    channel_type: 'im'
}

const InstallationObject = {
    team: { id: 'T06EYPYRU77', name: 'bully' },
    enterprise: undefined,
    user: { token: undefined, scopes: undefined, id: 'U06FQFAUH4G' },
    tokenType: 'bot',
    isEnterpriseInstall: false,
    appId: 'A06F1G554P9',
    authVersion: 'v2',
    bot: {
        scopes: ['chat:write', 'im:history'],
        token: 'xoxb-6508814878245-6523265392101-D8RdGSK6XDt1RZvEdMF15LvZ',
        userId: 'U06FD7TBJ2Z',
        id: 'B06FJJZ7XRA'
    },
    chatbotId: '7dbb2de1-ed77-4831-9150-969f96b1494e',
    conversation_id: '172cd757-e974-49e3-bfce-957f0bcc7c3a'
}
const demoSendObject = {
    "query": "price of plan 3",
    "chatbot_id": "366acd06-c78b-4522-a525-b72963005038",
    "conversation_id": "b0dd24a9-1070-46e0-a5e0-950067d57742",
    "messages": [
        {
            "role": "assistant",
            "content": "Hi, What can I help you with?"
        },
        {
            "content": "price of plan1",
            "role": "user",
            "timestamp": 1706200993199
        },
        {
            "content": "I'm sorry, but I need more information to provide an accurate answer. Could you please specify what \"plan1\" refers to?",
            "role": "assistant",
            "timestamp": 1706200996046
        },
        {
            "content": "price of plan 1",
            "role": "user",
            "timestamp": 1706201104075
        },
        {
            "content": "\"Plan1\" refers to the first pricing plan offered by Elephant.ai. It is a free plan that allows you to create 1 chatbot, with 25 source URLs per chatbot, and 1,000 monthly queries.",
            "role": "assistant",
            "timestamp": 1706201110575
        },
        {
            "content": "price of plan 2",
            "role": "user",
            "timestamp": 1706201118904
        },
        {
            "content": "Plan2 refers to a pricing plan offered by Elephant.ai. It costs $49 per month and allows you to create 3 chatbots, with 200 source URLs per chatbot and 10,000 monthly queries.",
            "role": "assistant",
            "timestamp": 1706201124714
        },
        {
            "content": "price of plan 3",
            "role": "user",
            "timestamp": 1706201134860
        },
        {
            "content": "The details and cost of \"Plan3\" offered by Elephant.ai are as follows:\n\n- Price: $99 per month\n- Number of Chatbots: Create 5 Chatbots\n- Source URLs per Chatbot: 500\n- Monthly Queries: 25,000\n\nThis plan is designed to accommodate the needs of internet publishers and content website owners who require multiple chatbots and a higher volume of monthly queries.",
            "role": "assistant",
            "timestamp": 1706201139274
        }
    ]
}