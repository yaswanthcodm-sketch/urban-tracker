# RoadGuard AI — Computer Vision & Machine Learning Pipeline

This module provides the training, evaluation, and inference architecture for road distress and pothole detection.

---

## 1. Defect Classification Ontology

The system is designed around the standard Road Damage Detection (RDD) benchmark ontology:

| Class ID | Defect Class Name | Morphology & Features | Hazard / Severity Tier |
|---|---|---|---|
| 0 | **Pothole** | Localized concave bowl-shaped depression in asphalt with shadow cavity | High to Critical (Direct vehicle rim / rollover hazard) |
| 1 | **Road crack** | Generic single or branching fracture | Low to Medium |
| 2 | **Longitudinal crack** | Cracks running parallel to vehicle travel direction | Medium (Joint failure / wheel-path fatigue) |
| 3 | **Transverse crack** | Cracks running perpendicular across travel lanes | Medium (Thermal contraction / shrinkage) |
| 4 | **Alligator cracking** | Interconnected polygon-shaped fatigue cracking (crocodile skin pattern) | High to Critical (Subgrade base layer failure) |
| 5 | **Damaged road edge** | Shoulder erosion, lateral asphalt breakage | High (Edge drop-off hazard) |
| 6 | **Other visible road damage** | Raveling, bleeding, severe surface washouts | Variable |

---

## 2. Model Architecture & Fallback Strategy

RoadGuard AI implements a **dual-engine architecture**:

1. **Primary Neural Detector (Ultralytics YOLOv8/v9/v11)**:
   - When trained weights are placed at `ml/weights/best.pt`, the backend loads the YOLO neural network for real-time bounding box prediction.
2. **OpenCV Morphological & Contour Vision Analyzer (Verified Fallback)**:
   - Built-in OpenCV feature extractor that functions immediately out-of-the-box without requiring gigabytes of GPU weights.
   - Computes grayscale surface depressions, Canny edge gradients, and contour aspect ratios to accurately classify potholes, longitudinal lines, and alligator mesh patterns.
   - Evaluates damage severity based on the bounding box surface area relative to total road frame dimensions.

---

## 3. Dataset Preparation (YOLO Format)

Prepare your labeled dataset in standard YOLO format:

```
dataset/
├── data.yaml
├── train/
│   ├── images/
│   └── labels/
└── val/
    ├── images/
    └── labels/
```

Example `data.yaml`:
```yaml
path: ./dataset
train: train/images
val: val/images

names:
  0: Pothole
  1: Road crack
  2: Longitudinal crack
  3: Transverse crack
  4: Alligator cracking
  5: Damaged road edge
  6: Other visible road damage
```

---

## 4. Model Training

Run the training pipeline with `ml/train.py`:

```bash
python ml/train.py --data dataset/data.yaml --model yolov8m.pt --epochs 50 --imgsz 640 --batch 16
```

The script automatically:
- Initializes pre-trained weights
- Trains with mosaic, affine, and hue augmentations
- Exports best checkpoint to `ml/weights/best.pt`

---

## 5. Model Evaluation

Evaluate precision, recall, and mAP@50-95 using `ml/evaluate.py`:

```bash
python ml/evaluate.py --weights ml/weights/best.pt --data dataset/data.yaml
```
