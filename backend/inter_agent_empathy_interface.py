import json
import os
import random
from datetime import datetime
import requests
from urllib.parse import urlencode
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("data/inter_agent_empathy.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("inter_agent_empathy")

class InterAgentEmpathyInterface:
    """
    Inter-Agent Empathy Interface for Mashaaer

    This class implements an interface for the assistant to communicate with other AI agents
    to better understand the user. It allows Mashaaer to consult with other AI systems
    to gain different perspectives and insights about user queries and emotions.

    Features:
    - Communication with external AI agents
    - Perspective gathering from different AI systems
    - Empathy enhancement through multi-agent consultation
    - Insight integration from various AI perspectives
    """

    def __init__(self):
        """Initialize the inter-agent empathy interface"""
        self.empathy_data = {
            'consultations': [],
            'insights_gained': [],
            'last_consultation': None,
            'available_agents': {
                'claude': {
                    'name': 'Claude',
                    'description': 'Anthropic\'s AI assistant with strong reasoning capabilities',
                    'specialty': 'nuanced understanding and thoughtful responses',
                    'enabled': False,  # Disabled by default, would require API key
                    'api_url': 'https://api.anthropic.com/v1/messages',
                    'api_key': None  # Would be set from environment or config
                },
                'gpt': {
                    'name': 'GPT',
                    'description': 'OpenAI\'s language model with broad knowledge',
                    'specialty': 'creative solutions and diverse perspectives',
                    'enabled': False,  # Disabled by default, would require API key
                    'api_url': 'https://api.openai.com/v1/chat/completions',
                    'api_key': None  # Would be set from environment or config
                },
                'llama': {
                    'name': 'Llama',
                    'description': 'Meta\'s open language model',
                    'specialty': 'straightforward analysis and practical advice',
                    'enabled': False,  # Disabled by default, would require API key
                    'api_url': 'https://api.meta.ai/llama/v1/chat',  # Example URL
                    'api_key': None  # Would be set from environment or config
                },
                'local_simulation': {
                    'name': 'Simulated Agent',
                    'description': 'A simulated AI agent for testing purposes',
                    'specialty': 'providing alternative perspectives (simulated)',
                    'enabled': True,  # Always enabled as fallback
                    'api_url': None,
                    'api_key': None
                }
            },
            'consultation_count': 0,
            'last_updated': datetime.now().isoformat()
        }

        # Load existing empathy data
        self.load_empathy_data()

        # Initialize API keys from environment variables if available
        self._initialize_api_keys()

    def load_empathy_data(self):
        """Load empathy data from storage file"""
        empathy_path = 'data/inter_agent_empathy.json'
        try:
            if os.path.exists(empathy_path):
                with open(empathy_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.empathy_data = data

                    # Ensure we don't override the enabled status of local_simulation
                    if 'available_agents' in data and 'local_simulation' in data['available_agents']:
                        self.empathy_data['available_agents']['local_simulation']['enabled'] = True
        except Exception as e:
            logger.error(f"Error loading empathy data: {e}")
            # Keep default values if loading fails

    def save_empathy_data(self):
        """Save empathy data to storage file"""
        empathy_path = 'data/inter_agent_empathy.json'
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(empathy_path), exist_ok=True)

            with open(empathy_path, 'w', encoding='utf-8') as f:
                json.dump(self.empathy_data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error(f"Error saving empathy data: {e}")

    def _initialize_api_keys(self):
        """Initialize API keys from environment variables"""
        # Claude API key
        claude_api_key = os.environ.get('CLAUDE_API_KEY')
        if claude_api_key:
            self.empathy_data['available_agents']['claude']['api_key'] = claude_api_key
            self.empathy_data['available_agents']['claude']['enabled'] = True

        # GPT API key
        gpt_api_key = os.environ.get('OPENAI_API_KEY')
        if gpt_api_key:
            self.empathy_data['available_agents']['gpt']['api_key'] = gpt_api_key
            self.empathy_data['available_agents']['gpt']['enabled'] = True

        # Llama API key
        llama_api_key = os.environ.get('LLAMA_API_KEY')
        if llama_api_key:
            self.empathy_data['available_agents']['llama']['api_key'] = llama_api_key
            self.empathy_data['available_agents']['llama']['enabled'] = True

    def consult_agents(self, user_input, user_context=None, user_emotion=None, consultation_type="understanding"):
        """
        Consult with other AI agents to gain different perspectives

        Args:
            user_input (str): The user's input
            user_context (dict, optional): Additional context about the user
            user_emotion (str, optional): The detected user emotion
            consultation_type (str): Type of consultation ("understanding", "advice", "perspective")

        Returns:
            dict: Results from the consultation
        """
        if not user_input:
            return {"success": False, "error": "No user input provided"}

        # Determine which agents to consult
        agents_to_consult = self._select_agents_for_consultation(consultation_type, user_emotion)

        if not agents_to_consult:
            return {"success": False, "error": "No suitable agents available for consultation"}

        # Prepare consultation record
        consultation = {
            'user_input': user_input,
            'user_emotion': user_emotion,
            'consultation_type': consultation_type,
            'timestamp': datetime.now().isoformat(),
            'agents_consulted': [],
            'responses': [],
            'integrated_insight': None
        }

        # Consult each selected agent
        for agent_id in agents_to_consult:
            agent = self.empathy_data['available_agents'][agent_id]

            # Prepare the prompt for the agent
            prompt = self._prepare_agent_prompt(agent_id, user_input, user_context, user_emotion, consultation_type)

            # Get response from the agent
            response = self._get_agent_response(agent_id, prompt)

            if response:
                consultation['agents_consulted'].append(agent_id)
                consultation['responses'].append({
                    'agent_id': agent_id,
                    'agent_name': agent['name'],
                    'response': response
                })

        # If we got responses, integrate them into an insight
        if consultation['responses']:
            consultation['integrated_insight'] = self._integrate_agent_responses(
                consultation['responses'], 
                consultation_type
            )

            # Add to insights gained
            if consultation['integrated_insight']:
                self.empathy_data['insights_gained'].append({
                    'insight': consultation['integrated_insight'],
                    'consultation_type': consultation_type,
                    'user_emotion': user_emotion,
                    'timestamp': datetime.now().isoformat()
                })

        # Update consultation record
        self.empathy_data['consultations'].append(consultation)
        self.empathy_data['last_consultation'] = datetime.now().isoformat()
        self.empathy_data['consultation_count'] += 1

        # Update last updated timestamp
        self.empathy_data['last_updated'] = datetime.now().isoformat()

        # Save empathy data
        self.save_empathy_data()

        # Return the results
        return {
            "success": True,
            "consultation": consultation,
            "integrated_insight": consultation['integrated_insight']
        }

    def _select_agents_for_consultation(self, consultation_type, user_emotion=None):
        """
        Select appropriate agents for a consultation

        Args:
            consultation_type (str): Type of consultation
            user_emotion (str, optional): The detected user emotion

        Returns:
            list: IDs of selected agents
        """
        # Get all enabled agents
        enabled_agents = [
            agent_id for agent_id, agent in self.empathy_data['available_agents'].items()
            if agent['enabled']
        ]

        # If no external agents are enabled, always use the local simulation
        if not enabled_agents or (len(enabled_agents) == 1 and enabled_agents[0] == 'local_simulation'):
            return ['local_simulation']

        # For different consultation types, we might want different agents
        if consultation_type == "understanding":
            # For understanding, prefer agents with good empathy
            preferred_agents = ['claude', 'gpt']
        elif consultation_type == "advice":
            # For advice, prefer agents with practical knowledge
            preferred_agents = ['gpt', 'llama']
        elif consultation_type == "perspective":
            # For perspective, use a diverse set of agents
            preferred_agents = ['claude', 'gpt', 'llama']
        else:
            # Default to all enabled agents
            preferred_agents = enabled_agents

        # Filter preferred agents to only include enabled ones
        selected_agents = [agent for agent in preferred_agents if agent in enabled_agents]

        # If we have more than 2 agents, randomly select 2 to avoid too many API calls
        if len(selected_agents) > 2:
            selected_agents = random.sample(selected_agents, 2)

        # Always include local simulation if no external agents are available
        if not selected_agents:
            selected_agents = ['local_simulation']

        return selected_agents

    def _prepare_agent_prompt(self, agent_id, user_input, user_context, user_emotion, consultation_type):
        """
        Prepare a prompt for an AI agent

        Args:
            agent_id (str): The ID of the agent
            user_input (str): The user's input
            user_context (dict): Additional context about the user
            user_emotion (str): The detected user emotion
            consultation_type (str): Type of consultation

        Returns:
            str: The prepared prompt
        """
        # Base prompt template
        prompt_template = """
        You are helping another AI assistant named Mashaaer understand a user better. 
        Mashaaer is an Arabic voice assistant with emotion detection capabilities.

        User's message: "{user_input}"
        {emotion_context}

        {consultation_instruction}

        Please provide your response in Arabic. Focus on being helpful, empathetic, and insightful.
        Keep your response concise (100-150 words maximum).
        """

        # Add emotion context if available
        emotion_context = ""
        if user_emotion:
            emotion_context = f"Detected emotion: {user_emotion}"

        # Customize instruction based on consultation type
        if consultation_type == "understanding":
            consultation_instruction = """
            Please help understand what might be behind this user's message. 
            What emotions, needs, or intentions might they have that aren't explicitly stated?
            """
        elif consultation_type == "advice":
            consultation_instruction = """
            What advice or guidance might be helpful for this user based on their message?
            Consider both practical suggestions and emotional support.
            """
        elif consultation_type == "perspective":
            consultation_instruction = """
            Please provide an alternative perspective on the user's situation.
            What might they be overlooking or what different way could they think about their situation?
            """
        else:
            consultation_instruction = """
            Please provide your thoughts on how to best respond to this user.
            """

        # Fill in the template
        prompt = prompt_template.format(
            user_input=user_input,
            emotion_context=emotion_context,
            consultation_instruction=consultation_instruction
        )

        return prompt

    def _get_agent_response(self, agent_id, prompt):
        """
        Get a response from an AI agent

        Args:
            agent_id (str): The ID of the agent
            prompt (str): The prompt to send to the agent

        Returns:
            str: The agent's response or None if there was an error
        """
        agent = self.empathy_data['available_agents'][agent_id]

        # If this is the local simulation, use that instead of making an API call
        if agent_id == 'local_simulation':
            return self._get_simulated_response(prompt)

        # Check if the agent is properly configured
        if not agent['api_url'] or not agent['api_key']:
            logger.warning(f"Agent {agent_id} is not properly configured (missing API URL or key)")
            return None

        # Make the API call based on the agent type
        try:
            if agent_id == 'claude':
                return self._call_claude_api(prompt, agent['api_key'], agent['api_url'])
            elif agent_id == 'gpt':
                return self._call_gpt_api(prompt, agent['api_key'], agent['api_url'])
            elif agent_id == 'llama':
                return self._call_llama_api(prompt, agent['api_key'], agent['api_url'])
            else:
                logger.warning(f"Unknown agent type: {agent_id}")
                return None
        except Exception as e:
            logger.error(f"Error calling {agent_id} API: {e}")
            return None

    def _call_claude_api(self, prompt, api_key, api_url):
        """
        Call the Claude API

        Args:
            prompt (str): The prompt to send
            api_key (str): The API key
            api_url (str): The API URL

        Returns:
            str: The response text
        """
        # This is a simplified implementation - in a real system, you would use the actual Claude API
        headers = {
            "x-api-key": api_key,
            "content-type": "application/json"
        }

        data = {
            "model": "claude-2",
            "prompt": prompt,
            "max_tokens_to_sample": 300
        }

        try:
            # In a real implementation, this would be an actual API call
            # response = requests.post(api_url, headers=headers, json=data)
            # response.raise_for_status()
            # return response.json()["completion"]

            # For now, fall back to simulation
            logger.info("Claude API call would happen here - falling back to simulation")
            return self._get_simulated_response(prompt)
        except Exception as e:
            logger.error(f"Error calling Claude API: {e}")
            return None

    def _call_gpt_api(self, prompt, api_key, api_url):
        """
        Call the GPT API

        Args:
            prompt (str): The prompt to send
            api_key (str): The API key
            api_url (str): The API URL

        Returns:
            str: The response text
        """
        # This is a simplified implementation - in a real system, you would use the actual OpenAI API
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        data = {
            "model": "gpt-4",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 300
        }

        try:
            # In a real implementation, this would be an actual API call
            # response = requests.post(api_url, headers=headers, json=data)
            # response.raise_for_status()
            # return response.json()["choices"][0]["message"]["content"]

            # For now, fall back to simulation
            logger.info("GPT API call would happen here - falling back to simulation")
            return self._get_simulated_response(prompt)
        except Exception as e:
            logger.error(f"Error calling GPT API: {e}")
            return None

    def _call_llama_api(self, prompt, api_key, api_url):
        """
        Call the Llama API

        Args:
            prompt (str): The prompt to send
            api_key (str): The API key
            api_url (str): The API URL

        Returns:
            str: The response text
        """
        # This is a simplified implementation - in a real system, you would use the actual Llama API
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        data = {
            "prompt": prompt,
            "max_tokens": 300
        }

        try:
            # In a real implementation, this would be an actual API call
            # response = requests.post(api_url, headers=headers, json=data)
            # response.raise_for_status()
            # return response.json()["generation"]

            # For now, fall back to simulation
            logger.info("Llama API call would happen here - falling back to simulation")
            return self._get_simulated_response(prompt)
        except Exception as e:
            logger.error(f"Error calling Llama API: {e}")
            return None

    def _get_simulated_response(self, prompt):
        """
        Generate a simulated response for testing purposes

        Args:
            prompt (str): The prompt

        Returns:
            str: A simulated response
        """
        # Extract the user input from the prompt
        user_input_match = re.search(r'User\'s message: "([^"]+)"', prompt)
        user_input = user_input_match.group(1) if user_input_match else "Unknown input"

        # Extract the consultation type from the prompt
        consultation_type = "understanding"  # Default
        if "what might be behind this user's message" in prompt.lower():
            consultation_type = "understanding"
        elif "advice or guidance" in prompt.lower():
            consultation_type = "advice"
        elif "alternative perspective" in prompt.lower():
            consultation_type = "perspective"

        # Detect if the prompt mentions an emotion
        emotion = None
        emotion_match = re.search(r'Detected emotion: (\w+)', prompt)
        if emotion_match:
            emotion = emotion_match.group(1)

        # Generate a response based on the consultation type and emotion
        if consultation_type == "understanding":
            understanding_responses = [
                f"يبدو أن المستخدم يشعر بـ{emotion if emotion else 'مشاعر معقدة'} ويحتاج إلى التعاطف والفهم. قد يكون هناك شعور بالإحباط أو عدم اليقين وراء كلماته.",
                f"أرى أن المستخدم يبحث عن إجابات عميقة لأسئلة تشغل باله. هناك حاجة للاستماع والتفهم أكثر من تقديم حلول سريعة.",
                f"من المحتمل أن المستخدم يمر بتجربة صعبة ويحتاج إلى مساحة للتعبير عن مشاعره. الاعتراف بهذه المشاعر قد يكون أكثر أهمية من تقديم النصائح."
            ]
            return random.choice(understanding_responses)

        elif consultation_type == "advice":
            advice_responses = [
                f"أقترح أن تشجع المستخدم على التفكير في خطوات صغيرة وملموسة يمكنه اتخاذها. أحياناً تبدأ الرحلات الكبيرة بخطوات صغيرة.",
                f"قد يستفيد المستخدم من التركيز على ما يمكنه التحكم فيه، بدلاً من القلق بشأن ما هو خارج سيطرته. هذا يمكن أن يمنحه شعوراً بالقوة.",
                f"من المفيد تذكير المستخدم بأنه ليس وحيداً في تجربته. مشاركة قصص مماثلة (دون تقليل من تجربته) قد تكون مفيدة."
            ]
            return random.choice(advice_responses)

        elif consultation_type == "perspective":
            perspective_responses = [
                f"قد يكون من المفيد للمستخدم أن ينظر إلى الموقف من زاوية مختلفة. ما يبدو تحدياً الآن قد يكون فرصة للنمو في المستقبل.",
                f"أحياناً نركز كثيراً على جانب واحد من المشكلة. شجع المستخدم على التفكير في الجوانب الإيجابية التي قد لا يراها حالياً.",
                f"قد يكون المستخدم محاصراً في نمط تفكير محدد. مساعدته على رؤية الصورة الأكبر يمكن أن يفتح آفاقاً جديدة للحلول."
            ]
            return random.choice(perspective_responses)

        else:
            general_responses = [
                f"أعتقد أن الاستماع بتعاطف هو أفضل استجابة هنا. المستخدم يحتاج إلى الشعور بأنه مفهوم ومقدر.",
                f"من المهم الموازنة بين تقديم الدعم العاطفي والمشورة العملية. كن حاضراً مع المستخدم في لحظته الحالية.",
                f"أحياناً أفضل ما يمكننا تقديمه هو مساحة آمنة للتعبير. كن صبوراً واسمح للمستخدم بالتعبير عن نفسه بالكامل."
            ]
            return random.choice(general_responses)

    def _integrate_agent_responses(self, responses, consultation_type):
        """
        Integrate responses from multiple agents into a cohesive insight

        Args:
            responses (list): Responses from different agents
            consultation_type (str): Type of consultation

        Returns:
            str: An integrated insight
        """
        if not responses:
            return None

        # If we only have one response, use it directly
        if len(responses) == 1:
            return responses[0]['response']

        # For multiple responses, create an integrated insight based on the consultation type
        if consultation_type == "understanding":
            # For understanding, focus on the emotional aspects and deeper insights
            understanding_templates = [
                "من وجهات نظر مختلفة، يبدو أن المستخدم {insight_1}. كما أنه من المحتمل أنه {insight_2}.",
                "هناك اتفاق على أن المستخدم {insight_1}. بالإضافة إلى ذلك، {insight_2}.",
                "من خلال تحليل متعدد الزوايا، نرى أن المستخدم {insight_1}، وفي نفس الوقت {insight_2}."
            ]

            # Extract key insights from each response
            insights = []
            for response in responses:
                # In a real implementation, this would use NLP to extract key insights
                # For now, we'll just use the first sentence of each response
                first_sentence = response['response'].split('.')[0] + '.'
                insights.append(first_sentence)

            # Select a template and fill it
            template = random.choice(understanding_templates)
            integrated_insight = template.format(
                insight_1=insights[0].lower() if insights[0].endswith('.') else insights[0].lower()[:-1],
                insight_2=insights[1].lower() if insights[1].endswith('.') else insights[1].lower()[:-1]
            )

            return integrated_insight

        elif consultation_type == "advice":
            # For advice, combine practical suggestions
            advice_templates = [
                "بناءً على عدة وجهات نظر، يمكن أن نقترح: {advice_1} كما يمكن أيضاً {advice_2}.",
                "هناك عدة طرق للمساعدة: أولاً، {advice_1}. ثانياً، {advice_2}.",
                "من المفيد أن {advice_1}. بالإضافة إلى ذلك، {advice_2}."
            ]

            # Extract advice from each response
            advice_points = []
            for response in responses:
                # In a real implementation, this would use NLP to extract advice
                # For now, we'll just use the first sentence of each response
                first_sentence = response['response'].split('.')[0] + '.'
                advice_points.append(first_sentence)

            # Select a template and fill it
            template = random.choice(advice_templates)
            integrated_insight = template.format(
                advice_1=advice_points[0].lower() if advice_points[0].endswith('.') else advice_points[0].lower()[:-1],
                advice_2=advice_points[1].lower() if advice_points[1].endswith('.') else advice_points[1].lower()[:-1]
            )

            return integrated_insight

        elif consultation_type == "perspective":
            # For perspective, highlight different viewpoints
            perspective_templates = [
                "هناك عدة زوايا للنظر إلى هذا الموقف: من ناحية، {perspective_1} ومن ناحية أخرى، {perspective_2}.",
                "يمكن النظر إلى هذا الأمر بطريقتين: الأولى، {perspective_1}. والثانية، {perspective_2}.",
                "لنفكر خارج الصندوق: {perspective_1} وبالمقابل، {perspective_2}."
            ]

            # Extract perspectives from each response
            perspectives = []
            for response in responses:
                # In a real implementation, this would use NLP to extract perspectives
                # For now, we'll just use the first sentence of each response
                first_sentence = response['response'].split('.')[0] + '.'
                perspectives.append(first_sentence)

            # Select a template and fill it
            template = random.choice(perspective_templates)
            integrated_insight = template.format(
                perspective_1=perspectives[0].lower() if perspectives[0].endswith('.') else perspectives[0].lower()[:-1],
                perspective_2=perspectives[1].lower() if perspectives[1].endswith('.') else perspectives[1].lower()[:-1]
            )

            return integrated_insight

        else:
            # For other types, simply combine the responses
            combined_response = f"{responses[0]['response']} {responses[1]['response']}"
            return combined_response

    def get_recent_insights(self, limit=3):
        """
        Get recent insights gained from consultations

        Args:
            limit (int): Maximum number of insights to return

        Returns:
            list: Recent insights
        """
        # Sort insights by timestamp (newest first)
        sorted_insights = sorted(
            self.empathy_data['insights_gained'],
            key=lambda x: x['timestamp'],
            reverse=True
        )

        return sorted_insights[:limit]

    def should_consult_agents(self, user_input, user_emotion=None):
        """
        Determine if agents should be consulted for this input

        Args:
            user_input (str): The user's input
            user_emotion (str, optional): The detected user emotion

        Returns:
            bool: True if agents should be consulted, False otherwise
        """
        # Don't consult for very short inputs
        if len(user_input.split()) < 5:
            return False

        # Check when the last consultation was performed
        if self.empathy_data['last_consultation']:
            last_consultation_time = datetime.fromisoformat(self.empathy_data['last_consultation'])
            now = datetime.now()

            # Don't consult too frequently (at least 5 minutes between consultations)
            if (now - last_consultation_time).seconds < 300:  # 5 minutes in seconds
                return False

        # Consult more often for strong emotions
        strong_emotions = ["حزن شديد", "غضب", "خوف", "قلق شديد"]
        if user_emotion in strong_emotions:
            return True

        # Consult for complex or long inputs
        if len(user_input.split()) > 20:
            return True

        # Consult for questions about personal or emotional topics
        personal_keywords = ["أشعر", "مشاعر", "حياتي", "علاقة", "مشكلة شخصية", "حزين", "سعيد", "غاضب", "خائف"]
        if any(keyword in user_input.lower() for keyword in personal_keywords):
            return True

        # Consult with some random probability for other inputs
        return random.random() < 0.2  # 20% chance for other inputs

    def get_empathy_status(self):
        """
        Get the current status of the empathy interface

        Returns:
            dict: Status information
        """
        # Count recent consultations
        now = datetime.now()
        recent_consultations = 0

        for consultation in self.empathy_data['consultations']:
            consultation_time = datetime.fromisoformat(consultation['timestamp'])
            if (now - consultation_time).days <= 1:  # Within the last day
                recent_consultations += 1

        # Count enabled agents
        enabled_agents = [
            agent_id for agent_id, agent in self.empathy_data['available_agents'].items()
            if agent['enabled']
        ]

        return {
            'enabled_agents': enabled_agents,
            'total_consultations': self.empathy_data['consultation_count'],
            'recent_consultations': recent_consultations,
            'last_consultation': self.empathy_data['last_consultation'],
            'insights_gained': len(self.empathy_data['insights_gained'])
        }

# Example usage
if __name__ == "__main__":
    import re  # Import re module for the _get_simulated_response method

    empathy_interface = InterAgentEmpathyInterface()

    # Test consultation
    result = empathy_interface.consult_agents(
        "أنا حزين جداً اليوم ولا أعرف ماذا أفعل. أشعر بالوحدة والإحباط.",
        user_emotion="حزن"
    )

    if result["success"]:
        print(f"Integrated insight: {result['integrated_insight']}")
    else:
        print(f"Error: {result.get('error', 'Unknown error')}")

    # Get empathy status
    status = empathy_interface.get_empathy_status()
    print(f"Empathy status: {status}")
