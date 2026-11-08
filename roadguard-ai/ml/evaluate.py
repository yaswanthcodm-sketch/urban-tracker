"""
RoadGuard AI — YOLO Road Damage Model Evaluation Script
"""
import argparse
import os
from pathlib import Path

# Redirect Ultralytics settings to project workspace
ML_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = ML_DIR.parent
os.environ["YOLO_CONFIG_DIR"] = str(ML_DIR / ".ultralytics")
os.makedirs(ML_DIR / ".ultralytics", exist_ok=True)


def evaluate_model(
    weights_path: str = "ml/weights/best.pt",
    data_yaml: str = "dataset/data.yaml",
    imgsz: int = 640,
):
    print("=== RoadGuard AI — Model Benchmark Evaluation ===")
    print(f"Weights: {weights_path} | Data: {data_yaml}")

    if not os.path.exists(weights_path):
        print(f"Model weights '{weights_path}' not found.")
        print("RoadGuard AI is utilizing the verified OpenCV Morphological Analyzer as default.")
        return

    try:
        from ultralytics import YOLO, settings as yolo_settings
        env_file = PROJECT_ROOT / ".env"
        if env_file.exists():
            with open(env_file, "r") as f:
                for line in f:
                    if line.startswith("YOLO_API_KEY=") or line.startswith("ULTRALYTICS_API_KEY="):
                        k = line.split("=", 1)[1].strip().strip('"').strip("'")
                        if k:
                            yolo_settings.update({'api_key': k})
                            print(f"[Evaluation] Authenticated with Ultralytics API key: {k[:8]}...")
                            break
    except ImportError:
        print("Ultralytics package not installed. Install via: pip install ultralytics")
        return

    model = YOLO(weights_path)
    metrics = model.val(data=data_yaml, imgsz=imgsz)

    print("\n--- Benchmark Validation Results ---")
    print(f"mAP@50:    {metrics.box.map50:.4f}")
    print(f"mAP@50-95: {metrics.box.map:.4f}")
    print(f"Precision: {metrics.box.mp:.4f}")
    print(f"Recall:    {metrics.box.mr:.4f}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate RoadGuard AI YOLO Model")
    parser.add_argument("--weights", default="ml/weights/best.pt", help="Path to best.pt weights")
    parser.add_argument("--data", default="dataset/data.yaml", help="Path to data.yaml")
    parser.add_argument("--imgsz", type=int, default=640, help="Image resolution")
    args = parser.parse_args()

    evaluate_model(
        weights_path=args.weights,
        data_yaml=args.data,
        imgsz=args.imgsz,
    )
