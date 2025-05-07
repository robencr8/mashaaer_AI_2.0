import os, json

def collect_training_data(corpus_dir="fine_tune_corpus"):
    samples = []
    for file in os.listdir(corpus_dir):
        if file.endswith(".json"):
            with open(os.path.join(corpus_dir, file), encoding="utf-8") as f:
                data = json.load(f)
                samples.append(f"<|prompt|>{data['prompt']}<|response|>{data['response']}")
    return samples

def write_dataset(samples, out_file="dataset.txt"):
    with open(out_file, "w", encoding="utf-8") as f:
        f.write("\n".join(samples))

if __name__ == "__main__":
    dataset = collect_training_data()
    write_dataset(dataset)
    print(f"✅ Collected {len(dataset)} samples.")