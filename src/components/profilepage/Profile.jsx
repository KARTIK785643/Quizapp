import React, { useState, useEffect } from "react";
import styles from "../styles/Profile.module.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found. Please log in again.");
        }

        const response = await fetch("http://localhost:5000/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data. Please log in again.");
        }

        const data = await response.json();
        console.log("✅ Fetched user data:", data);

        if (!data.user || !data.user.email) {
          throw new Error("User data is incomplete. Please log in again.");
        }

        setUser(data.user);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching profile data:", error.message);
        setError(error.message);
        setLoading(false);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        localStorage.setItem("userProfileImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = () => {
    if (uploadedImage) {
      alert("Image uploaded successfully!");
    } else {
      alert("Please select an image first");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!user) {
    return <div className={styles.error}>User profile not found</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.profileImageSection}>
          <div className={styles.profileImageContainer}>
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" className={styles.profileImage} />
            ) : (
              <div className={styles.profileImagePlaceholder}>
                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>

          <div className={styles.imageUploadControls}>
            <input
              type="file"
              id="profile-image"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
              style={{ display: "none" }}
            />
            <label htmlFor="profile-image" className={styles.uploadButton}>
              Choose Image
            </label>

            {uploadedImage && (
              <button onClick={handleImageUpload} className={styles.saveImageButton}>
                Save Image
              </button>
            )}
          </div>
        </div>

        <h2 className={styles.profileTitle}>User Profile</h2>
        <div className={styles.profileInfo}>
          <div className={styles.profileField}>
            <span className={styles.fieldLabel}>Username:</span>
            <span className={styles.fieldValue}>{user.username || "N/A"}</span>
          </div>
          <div className={styles.profileField}>
            <span className={styles.fieldLabel}>Email:</span>
            <span className={styles.fieldValue}>{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
