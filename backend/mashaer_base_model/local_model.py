from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

_tokenizer = AutoTokenizer.from_pretrained("aubmindlab/aragpt2-base")
_model = AutoModelForCausalLM.from_pretrained("aubmindlab/aragpt2-base")

def local_brain(prompt: str, max_tokens: int = 150) -> str:
    tokens = _tokenizer(prompt, return_tensors="pt")
    output = _model.generate(**tokens, max_new_tokens=max_tokens, pad_token_id=_tokenizer.eos_token_id)
    return _tokenizer.decode(output[0], skip_special_tokens=True)