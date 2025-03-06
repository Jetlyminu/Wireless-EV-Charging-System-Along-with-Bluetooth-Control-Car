import cv2
import face_recognition
import csv
from datetime import datetime

# Load a known face and encode it
known_image = face_recognition.load_image_file("known_faces/person.jpg")  # Replace with an actual image path
known_encoding = face_recognition.face_encodings(known_image)[0]

# Initialize webcam
video_capture = cv2.VideoCapture(0)

def mark_attendance(name):
    now = datetime.now()
    dt_string = now.strftime('%Y-%m-%d %H:%M:%S')
    with open("attendance.csv", "a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([name, dt_string])

while True:
    ret, frame = video_capture.read()
    if not ret:
        break

    rgb_frame = frame[:, :, ::-1]
    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    for face_encoding, face_location in zip(face_encodings, face_locations):
        match = face_recognition.compare_faces([known_encoding], face_encoding)[0]
        name = "Unknown"
        if match:
            name = "Person"  # Change to actual name
            mark_attendance(name)

        top, right, bottom, left = face_location
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.putText(frame, name, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 255, 0), 2)

    cv2.imshow("Face Recognition", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

video_capture.release()
cv2.destroyAllWindows()
