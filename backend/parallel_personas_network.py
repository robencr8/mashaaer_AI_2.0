import json
import os
import random
from datetime import datetime
from persona_controller import set_persona

class ParallelPersonasNetwork:
    """
    Parallel Personas Network for Mashaaer
    
    This class implements a network of parallel personas that work together to provide responses.
    Each persona has its own personality, tone, and response style, and they collaborate to
    generate the final response.
    
    Features:
    - Multiple personas with different personalities
    - Persona voting system for response selection
    - Adaptive persona weighting based on user feedback
    - Persona evolution over time
    """
    
    def __init__(self):
        """Initialize the parallel personas network"""
        # Define the stack of personas
        self.personas = {
            "حنون": {  # Caring
                "description": "شخصية حنونة تهتم بمشاعر المستخدم وتقدم الدعم العاطفي",
                "tone": "دافئ ومتعاطف",
                "strengths": ["التعاطف", "الاستماع", "الدعم"],
                "weaknesses": ["قد تكون مفرطة في العاطفة"],
                "best_for_emotions": ["حزن", "قلق", "خوف"],
                "response_style": "تبدأ بالتعاطف ثم تقدم الدعم",
                "weight": 1.0
            },
            "مستشار": {  # Advisor
                "description": "شخصية حكيمة تقدم النصائح والإرشادات العملية",
                "tone": "هادئ وحكيم",
                "strengths": ["التحليل", "الحكمة", "الحلول العملية"],
                "weaknesses": ["قد تبدو متعالية أحياناً"],
                "best_for_emotions": ["حيرة", "قلق", "إحباط"],
                "response_style": "تحليل الموقف ثم تقديم النصيحة",
                "weight": 1.0
            },
            "صديق مهضوم": {  # Funny friend
                "description": "شخصية مرحة تضفي جواً من البهجة والفكاهة",
                "tone": "مرح وخفيف",
                "strengths": ["الفكاهة", "تخفيف التوتر", "الإيجابية"],
                "weaknesses": ["قد لا تناسب المواقف الجدية"],
                "best_for_emotions": ["فرح", "ملل", "حماس"],
                "response_style": "تبدأ بملاحظة مرحة ثم تنتقل للموضوع",
                "weight": 1.0
            },
            "شاعر": {  # Poet
                "description": "شخصية شاعرية تعبر بعمق وجمال عن المشاعر والأفكار",
                "tone": "عميق وتأملي",
                "strengths": ["التعبير الجميل", "العمق", "الإلهام"],
                "weaknesses": ["قد تكون غامضة أحياناً"],
                "best_for_emotions": ["حب", "حنين", "تأمل"],
                "response_style": "تستخدم لغة شاعرية وصور بلاغية",
                "weight": 1.0
            },
            "عالم": {  # Scientist
                "description": "شخصية علمية تقدم المعلومات والحقائق بدقة",
                "tone": "موضوعي ودقيق",
                "strengths": ["المعرفة", "الدقة", "التحليل المنطقي"],
                "weaknesses": ["قد تفتقر للعاطفة"],
                "best_for_emotions": ["فضول", "حيرة", "رغبة في التعلم"],
                "response_style": "تقديم المعلومات بشكل منظم ومدعم بالأدلة",
                "weight": 1.0
            },
            "فيلسوف": {  # Philosopher
                "description": "شخصية فلسفية تطرح الأسئلة العميقة وتتأمل في معنى الحياة",
                "tone": "تأملي وعميق",
                "strengths": ["التفكير العميق", "طرح الأسئلة", "التأمل"],
                "weaknesses": ["قد تكون مجردة أكثر من اللازم"],
                "best_for_emotions": ["حيرة وجودية", "تأمل", "بحث عن المعنى"],
                "response_style": "طرح أسئلة عميقة ثم تقديم تأملات",
                "weight": 1.0
            },
            "محايد": {  # Neutral
                "description": "شخصية محايدة تقدم المعلومات والمساعدة بشكل متوازن",
                "tone": "متوازن وهادئ",
                "strengths": ["التوازن", "الحيادية", "الوضوح"],
                "weaknesses": ["قد تفتقر للشخصية المميزة"],
                "best_for_emotions": ["حياد", "هدوء", "توازن"],
                "response_style": "تقديم معلومات واضحة ومباشرة",
                "weight": 1.0
            }
        }
        
        # Current active personas (can be a subset of all personas)
        self.active_personas = list(self.personas.keys())
        
        # Persona evolution data
        self.evolution_data = {
            "persona_usage": {},
            "user_feedback": {},
            "last_evolution": datetime.now().isoformat()
        }
        
        # Initialize persona usage counters
        for persona in self.personas:
            self.evolution_data["persona_usage"][persona] = 0
            self.evolution_data["user_feedback"][persona] = {
                "positive": 0,
                "negative": 0
            }
        
        # Load existing evolution data
        self.load_evolution_data()
    
    def load_evolution_data(self):
        """Load persona evolution data from storage file"""
        evolution_path = 'data/persona_evolution.json'
        try:
            if os.path.exists(evolution_path):
                with open(evolution_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.evolution_data = data
                    
                    # Ensure all personas have entries in the evolution data
                    for persona in self.personas:
                        if persona not in self.evolution_data["persona_usage"]:
                            self.evolution_data["persona_usage"][persona] = 0
                        if persona not in self.evolution_data["user_feedback"]:
                            self.evolution_data["user_feedback"][persona] = {
                                "positive": 0,
                                "negative": 0
                            }
        except Exception as e:
            print(f"Error loading persona evolution data: {e}")
    
    def save_evolution_data(self):
        """Save persona evolution data to storage file"""
        evolution_path = 'data/persona_evolution.json'
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(evolution_path), exist_ok=True)
            
            with open(evolution_path, 'w', encoding='utf-8') as f:
                json.dump(self.evolution_data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving persona evolution data: {e}")
    
    def get_persona_response(self, persona_name, user_input, context=None):
        """
        Generate a response from a specific persona
        
        Args:
            persona_name (str): The name of the persona
            user_input (str): The user's input
            context (dict, optional): Additional context
            
        Returns:
            dict: The persona's response with metadata
        """
        if persona_name not in self.personas:
            return None
        
        persona = self.personas[persona_name]
        
        # In a real implementation, this would use a more sophisticated method
        # to generate responses based on the persona's characteristics.
        # For now, we'll use a template-based approach.
        
        # Simple templates for each persona
        templates = {
            "حنون": [
                "أفهم شعورك. {input_reflection}. هل تريد أن أساعدك في هذا؟",
                "أنا هنا لأجلك. {input_reflection}. كيف يمكنني دعمك؟",
                "أشعر بما تمر به. {input_reflection}. دعنا نتحدث أكثر عن هذا."
            ],
            "مستشار": [
                "بناءً على ما ذكرت، أقترح {advice}. ما رأيك؟",
                "لو نظرنا للموضوع من زاوية أخرى، {perspective}. هل فكرت بهذه الطريقة؟",
                "هناك عدة خيارات يمكنك اتباعها: {options}. أي منها يبدو مناسباً لك؟"
            ],
            "صديق مهضوم": [
                "هههه، {humorous_observation}! على فكرة، {response}.",
                "تخيل لو {humorous_scenario}! بالنسبة لسؤالك، {response}.",
                "أنت تذكرني بـ{humorous_comparison}! بخصوص ما سألت عنه، {response}."
            ],
            "شاعر": [
                "كأن {poetic_image} يتراقص في كلماتك. {poetic_response}.",
                "في عمق ما تقول، أرى {poetic_image}. {poetic_response}.",
                "كلماتك تشبه {poetic_image}، تحمل {poetic_quality}. {poetic_response}."
            ],
            "عالم": [
                "من الناحية العلمية، {scientific_explanation}. هل هناك جانب معين تود معرفة المزيد عنه؟",
                "الأبحاث تشير إلى أن {scientific_fact}. بالإضافة إلى ذلك، {additional_information}.",
                "لنحلل هذا بشكل منهجي: {structured_analysis}. هل هذا يجيب على تساؤلك؟"
            ],
            "فيلسوف": [
                "هذا يدفعني للتساؤل: {philosophical_question}؟ ربما {philosophical_reflection}.",
                "في جوهر سؤالك يكمن تساؤل أعمق: {philosophical_question}. {philosophical_reflection}.",
                "لو تأملنا في {philosophical_concept}، نجد أن {philosophical_reflection}. ما رأيك؟"
            ],
            "محايد": [
                "{neutral_response}",
                "بشكل موضوعي، {neutral_response}",
                "من وجهة نظر محايدة، {neutral_response}"
            ]
        }
        
        # Select a random template for this persona
        template = random.choice(templates.get(persona_name, templates["محايد"]))
        
        # Generate placeholder content based on user input
        # In a real implementation, this would be much more sophisticated
        input_reflection = f"أفهم أنك تتحدث عن {user_input[:20]}..." if len(user_input) > 20 else f"أفهم ما تقوله عن {user_input}"
        advice = f"أن تفكر في {user_input[:15]} من زاوية مختلفة"
        perspective = f"يمكننا النظر إلى {user_input[:15]} كفرصة للتعلم"
        options = f"البحث أكثر عن {user_input[:10]}, أو مناقشة الموضوع مع خبير"
        humorous_observation = f"موضوع {user_input[:10]} يذكرني بموقف طريف"
        humorous_scenario = f"كل الناس تتحدث عن {user_input[:10]} في نفس الوقت"
        humorous_comparison = f"شخص يحاول شرح {user_input[:10]} لقطة"
        poetic_image = f"أمواج الأفكار حول {user_input[:10]}"
        poetic_response = f"دعنا نتأمل معاً في أعماق هذه الفكرة"
        poetic_quality = "عمقاً وجمالاً"
        scientific_explanation = f"ظاهرة {user_input[:15]} تخضع لقوانين محددة"
        scientific_fact = f"هناك دراسات حديثة حول {user_input[:15]}"
        additional_information = "هناك جوانب أخرى مثيرة للاهتمام في هذا الموضوع"
        structured_analysis = f"أولاً، لنفهم أساسيات {user_input[:10]}، ثم ننتقل إلى التفاصيل"
        philosophical_question = f"ما علاقة {user_input[:10]} بمفهومنا عن الذات"
        philosophical_reflection = f"تتجلى في {user_input[:10]} أسئلة وجودية عميقة"
        philosophical_concept = f"مفهوم {user_input[:10]} في سياق الوجود الإنساني"
        neutral_response = f"بخصوص {user_input[:15]}، هناك عدة جوانب يمكن مناقشتها"
        
        # Fill in the template
        response_text = template.format(
            input_reflection=input_reflection,
            advice=advice,
            perspective=perspective,
            options=options,
            humorous_observation=humorous_observation,
            humorous_scenario=humorous_scenario,
            humorous_comparison=humorous_comparison,
            poetic_image=poetic_image,
            poetic_response=poetic_response,
            poetic_quality=poetic_quality,
            scientific_explanation=scientific_explanation,
            scientific_fact=scientific_fact,
            additional_information=additional_information,
            structured_analysis=structured_analysis,
            philosophical_question=philosophical_question,
            philosophical_reflection=philosophical_reflection,
            philosophical_concept=philosophical_concept,
            neutral_response=neutral_response
        )
        
        # Update persona usage counter
        self.evolution_data["persona_usage"][persona_name] += 1
        self.save_evolution_data()
        
        return {
            "persona": persona_name,
            "text": response_text,
            "tone": persona["tone"],
            "confidence": self._calculate_confidence(persona_name, user_input, context)
        }
    
    def _calculate_confidence(self, persona_name, user_input, context=None):
        """
        Calculate the confidence level of a persona for a given input
        
        Args:
            persona_name (str): The name of the persona
            user_input (str): The user's input
            context (dict, optional): Additional context
            
        Returns:
            float: Confidence level (0.0-1.0)
        """
        if persona_name not in self.personas:
            return 0.0
        
        persona = self.personas[persona_name]
        base_confidence = 0.5  # Default confidence
        
        # Adjust based on emotion if available in context
        if context and "emotion" in context:
            emotion = context["emotion"]
            if emotion in persona["best_for_emotions"]:
                base_confidence += 0.3
        
        # Adjust based on user feedback history
        feedback = self.evolution_data["user_feedback"][persona_name]
        total_feedback = feedback["positive"] + feedback["negative"]
        if total_feedback > 0:
            feedback_score = feedback["positive"] / total_feedback
            base_confidence += (feedback_score - 0.5) * 0.2  # Adjust by up to ±0.1
        
        # Adjust based on persona weight (from evolution)
        base_confidence *= persona["weight"]
        
        # Ensure confidence is within bounds
        return max(0.1, min(base_confidence, 1.0))
    
    def get_responses(self, user_input, emotion=None, context=None):
        """
        Get responses from all active personas
        
        Args:
            user_input (str): The user's input
            emotion (str, optional): The detected emotion
            context (dict, optional): Additional context
            
        Returns:
            list: Responses from all active personas
        """
        if context is None:
            context = {}
        
        if emotion:
            context["emotion"] = emotion
        
        responses = []
        for persona_name in self.active_personas:
            response = self.get_persona_response(persona_name, user_input, context)
            if response:
                responses.append(response)
        
        # Sort responses by confidence
        responses.sort(key=lambda x: x["confidence"], reverse=True)
        
        return responses
    
    def select_response(self, responses, strategy="highest_confidence"):
        """
        Select the best response from multiple personas
        
        Args:
            responses (list): Responses from different personas
            strategy (str): Selection strategy
            
        Returns:
            dict: The selected response
        """
        if not responses:
            return None
        
        if strategy == "highest_confidence":
            # Select the response with the highest confidence
            return responses[0]
        
        elif strategy == "weighted_random":
            # Select a response using weighted random selection
            total_confidence = sum(r["confidence"] for r in responses)
            if total_confidence == 0:
                return random.choice(responses)
            
            rand_val = random.uniform(0, total_confidence)
            cumulative = 0
            for response in responses:
                cumulative += response["confidence"]
                if rand_val <= cumulative:
                    return response
            
            return responses[-1]  # Fallback
        
        elif strategy == "ensemble":
            # Create an ensemble response combining elements from multiple personas
            # This is a simplified implementation
            if len(responses) == 1:
                return responses[0]
            
            # Take the introduction from the highest confidence response
            intro = responses[0]["text"].split('.')[0] + '.'
            
            # Take the main content from the second highest confidence response
            if len(responses) > 1:
                main_parts = responses[1]["text"].split('.')
                if len(main_parts) > 1:
                    main = '.'.join(main_parts[1:-1]) + '.'
                else:
                    main = responses[1]["text"]
            else:
                main = ""
            
            # Take the conclusion from the third highest confidence response
            if len(responses) > 2:
                conclusion = responses[2]["text"].split('.')[-1]
            else:
                conclusion = ""
            
            ensemble_text = f"{intro} {main} {conclusion}".strip()
            
            return {
                "persona": "ensemble",
                "text": ensemble_text,
                "tone": "متنوع",
                "confidence": (responses[0]["confidence"] + 
                              (responses[1]["confidence"] if len(responses) > 1 else 0) +
                              (responses[2]["confidence"] if len(responses) > 2 else 0)) / min(3, len(responses))
            }
        
        # Default to highest confidence
        return responses[0]
    
    def process_user_feedback(self, persona_name, feedback_type):
        """
        Process user feedback for a persona
        
        Args:
            persona_name (str): The name of the persona
            feedback_type (str): "positive" or "negative"
            
        Returns:
            bool: True if feedback was processed successfully
        """
        if persona_name not in self.personas:
            return False
        
        if feedback_type not in ["positive", "negative"]:
            return False
        
        # Update feedback counter
        self.evolution_data["user_feedback"][persona_name][feedback_type] += 1
        
        # Check if we should evolve personas based on feedback
        self._check_for_evolution()
        
        # Save evolution data
        self.save_evolution_data()
        
        return True
    
    def _check_for_evolution(self):
        """Check if personas should evolve based on usage and feedback"""
        # Only evolve periodically
        last_evolution = datetime.fromisoformat(self.evolution_data["last_evolution"])
        now = datetime.now()
        
        # If less than a week has passed since the last evolution, skip
        if (now - last_evolution).days < 7:
            return
        
        # Adjust persona weights based on feedback
        for persona_name in self.personas:
            feedback = self.evolution_data["user_feedback"][persona_name]
            total_feedback = feedback["positive"] + feedback["negative"]
            
            if total_feedback >= 5:  # Only adjust if we have enough feedback
                positive_ratio = feedback["positive"] / total_feedback
                
                # Adjust weight based on positive feedback ratio
                if positive_ratio >= 0.8:
                    # Very positive feedback
                    self.personas[persona_name]["weight"] = min(1.5, self.personas[persona_name]["weight"] + 0.1)
                elif positive_ratio >= 0.6:
                    # Somewhat positive feedback
                    self.personas[persona_name]["weight"] = min(1.2, self.personas[persona_name]["weight"] + 0.05)
                elif positive_ratio <= 0.2:
                    # Very negative feedback
                    self.personas[persona_name]["weight"] = max(0.5, self.personas[persona_name]["weight"] - 0.1)
                elif positive_ratio <= 0.4:
                    # Somewhat negative feedback
                    self.personas[persona_name]["weight"] = max(0.8, self.personas[persona_name]["weight"] - 0.05)
        
        # Update active personas based on weights
        # Ensure at least 3 personas are always active
        sorted_personas = sorted(
            self.personas.items(),
            key=lambda x: x[1]["weight"],
            reverse=True
        )
        
        # Always keep the top 3 personas active
        self.active_personas = [p[0] for p in sorted_personas[:3]]
        
        # Add other personas with a probability based on their weight
        for persona_name, persona_data in sorted_personas[3:]:
            if random.random() < persona_data["weight"] * 0.5:
                self.active_personas.append(persona_name)
        
        # Update last evolution timestamp
        self.evolution_data["last_evolution"] = now.isoformat()
    
    def get_network_status(self):
        """
        Get the current status of the personas network
        
        Returns:
            dict: Network status information
        """
        # Calculate persona effectiveness based on usage and feedback
        persona_effectiveness = {}
        for persona_name in self.personas:
            usage = self.evolution_data["persona_usage"].get(persona_name, 0)
            feedback = self.evolution_data["user_feedback"].get(persona_name, {"positive": 0, "negative": 0})
            total_feedback = feedback["positive"] + feedback["negative"]
            
            effectiveness = 0.5  # Default
            if total_feedback > 0:
                effectiveness = feedback["positive"] / total_feedback
            
            persona_effectiveness[persona_name] = {
                "usage": usage,
                "positive_feedback": feedback["positive"],
                "negative_feedback": feedback["negative"],
                "effectiveness": effectiveness,
                "weight": self.personas[persona_name]["weight"],
                "is_active": persona_name in self.active_personas
            }
        
        return {
            "active_personas": self.active_personas,
            "persona_effectiveness": persona_effectiveness,
            "last_evolution": self.evolution_data["last_evolution"]
        }

# Example usage
if __name__ == "__main__":
    network = ParallelPersonasNetwork()
    
    # Get responses from all personas
    responses = network.get_responses("أنا حزين اليوم", "حزن")
    
    # Select the best response
    selected_response = network.select_response(responses, "highest_confidence")
    
    print(f"Selected persona: {selected_response['persona']}")
    print(f"Response: {selected_response['text']}")
    
    # Process positive feedback
    network.process_user_feedback(selected_response['persona'], "positive")
    
    # Get network status
    status = network.get_network_status()
    print(f"Network status: {status}")