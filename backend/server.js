require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Test route
app.get('/', (req, res) => {
    res.json({ status: 'Server is running!' });
});

// ✅ ElevenLabs Outbound Call
app.post('/call', async (req, res) => {
    const { name, phone, course } = req.body;

    if (!name || !phone || !course) {
        return res.status(400).json({ error: 'Name, phone, course required' });
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    try {
        const response = await fetch(
            `https://api.elevenlabs.io/v1/convai/twilio/outbound-call`,
            {
                method: 'POST',
                headers: {
                    'xi-api-key': process.env.ELEVENLABS_API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    agent_id: process.env.ELEVENLABS_AGENT_ID,
                    agent_phone_number_id: process.env.ELEVENLABS_PHONE_NUMBER_ID,
                    to_number: formattedPhone,
                    conversation_initiation_client_data: {
                        dynamic_variables: {
                            student_name: name,
                            course_interest: course,
                        }
                    }
                }),
            }
        );

        const data = await response.json();
        console.log('ElevenLabs call response:', data);

        if (response.ok) {
            res.json({ success: true, data });
        } else {
            res.status(400).json({ error: data });
        }
    } catch (error) {
        console.error('Call error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});