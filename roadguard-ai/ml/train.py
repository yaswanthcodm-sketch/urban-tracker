"""
RoadGuard AI — YOLO Road Damage Detection Model Training Script
"""
import argparse
import os
import sys
from pathlib import Path

# Redirect Ultralytics settings to project workspace
ML_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = ML_DIR.parent
os.environ["YOLO_CONFIG_DIR"] = str(ML_DIR / ".ultralytics")
os.makedirs(ML_DIR / ".ultralytics", exist_ok=True)


def train_model(
    data_yaml: str = "dataset/data.yaml",
    base_model: str = "yolov8m.pt",
    epochs: int = 50,
    batch_size: int = 16,
    imgsz: int = 640,
    device: str = "0",
    output_dir: str = "ml/weights",
):
    print(f"=== RoadGuard AI — Model Training Pipeline ===")
    print(f"Config: {data_yaml} | Base: {base_model} | Epochs: {epochs} | ImgSz: {imgsz}")

    try:
        from ultralytics import YOLO, settings as yolo_settings
        # Load API key from env if available
        env_file = PROJECT_ROOT / ".env"
        if env_file.exists():
            with open(env_file, "r") as f:
                for line in f:
                    if line.startswith("YOLO_API_KEY=") or line.startswith("ULTRALYTICS_API_KEY="):
                        k = line.split("=", 1)[1].strip().strip('"').strip("'")
                        if k:
                            yolo_settings.update({'api_key': k})
                            print(f"[Training] Authenticated with Ultralytics API key: {k[:8]}...")
                            break
    except ImportError:
        print("Ultralytics package not installed. Install via: pip install ultralytics")
        print("Note: The platform is currently operating on the built-in OpenCV Morphological Analyzer.")
        return

    if not os.path.exists(data_yaml):
        print(f"Dataset configuration '{data_yaml}' not found. Please review ml/README.md for dataset structure.")
        return

    os.makedirs(output_dir, exist_ok=True)
    model = YOLO(base_model)

    print("Beginning training session...")
    results = model.train(
        data=data_yaml,
        epochs=epochs,
        batch=batch_size,
        imgsz=imgsz,
        device=device,
        project=output_dir,
        name="roadguard_yolo",
        exist_ok=True,
    )

    best_checkpoint = Path(output_dir) / "roadguard_yolo" / "weights" / "best.pt"
    target_weights = Path(output_dir) / "best.pt"

    if best_checkpoint.exists():
        import shutil
        shutil.copyfile(str(best_checkpoint), str(target_weights))
        print(f"Training successfully completed! Best weights saved to: {target_weights}")
    else:
        print("Training finished.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train RoadGuard AI YOLO Model")
    parser.add_argument("--data", default="dataset/data.yaml", help="Path to data.yaml")
    parser.add_argument("--model", default="yolov8m.pt", help="Base model weights")
    parser.add_argument("--epochs", type=int, default=50, help="Number of training epochs")
    parser.add_argument("--batch", type=int, default=16, help="Batch size")
    parser.add_argument("--imgsz", type=int, default=640, help="Image size")
    parser.add_argument("--device", default="cpu", help="Device ('cpu', '0', etc.)")
    args = parser.parse_args()

    train_model(
        data_yaml=args.data,
        base_model=args.model,
        epochs=args.epochs,
        batch_size=args.batch,
        imgsz=args.imgsz,
        device=args.device,
    )
