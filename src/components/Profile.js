import React, { useContext, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import { auth, db, storage } from "../firebase";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, updateDoc, getDocs, collection } from "firebase/firestore";
import avatar from "../images/avatar.png";
import { updateProfile, updateEmail ,updatePassword} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile = (props) => {
    const { setisProfileOpen, setIsDropdownOpen } = props;
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [updateError, setUpdateError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedDisplayName, setUpdatedDisplayName] = useState(currentUser.displayName);
    const [updatedProfileImage, setUpdatedProfileImage] = useState(null);
    const [updatedEmail, setUpdatedEmail] = useState(currentUser.email);
    const [updatedPassword, setUpdatedPassword] = useState("");


    const openFullScreen = () => {
      document.getElementById("dp")?.requestFullscreen();
    };


    const updateProfileForOthers = async () => {
      const q = collection(db, "userChats");
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (document) => {
        const data = document.data();
        const fieldIds = Object.keys(data);
        fieldIds.forEach(async (fieldId) => {
          const userInfo = data[fieldId].userInfo;
          if (userInfo?.uid === currentUser.uid) {
            const updatedData = {
              [`${fieldId}.userInfo.uid`]: currentUser.uid,
              [`${fieldId}.userInfo.displayName`]: updatedDisplayName,
              [`${fieldId}.userInfo.photoURL`]: updatedProfileImage ? updatedProfileImage : currentUser.photoURL,
            };
            await updateDoc(doc(db, "userChats", document.id), updatedData);
          }
        });
      });
    };


    const handleUpdateProfile = async () => {
      try {
        const currentUserRef = doc(db, "users", currentUser.uid);
        // Email is updated
        if(updatedEmail!== currentUser.email) {
          await updateEmail(auth.currentUser,updatedEmail);
          await updateDoc(currentUserRef, {
            email: updatedEmail,
          });
        }
        // Password is updated
        if(updatedPassword) {
          await updatePassword(auth.currentUser, updatedPassword); 
        }
        // Only Display name has changed
        if ( !updatedProfileImage && updatedDisplayName !== currentUser.displayName ) {
          await updateProfile(auth.currentUser, {
            displayName: updatedDisplayName,
          });
          await updateDoc(currentUserRef, {
            displayName: updatedDisplayName,
          });
          updateProfileForOthers();
        }
        // Update the profile image with/without display name
        else if (updatedProfileImage) {
          const oldStorageRef = ref(storage, currentUser.displayName);
          if (oldStorageRef) {
            deleteObject(oldStorageRef);
          } else {
            console.log(`Old Image Reference Not Found`);
          }
          const newStorageRef = ref(storage, updatedDisplayName);
          const uploadTask = uploadBytesResumable( newStorageRef, updatedProfileImage);
          uploadTask.on(
            (error) => {
              console.log(error.message);
              setUpdateError("Failed to upload new avatar");
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
                await updateProfile(auth.currentUser, {
                  displayName: updatedDisplayName,
                  photoURL: downloadURL,
                });
                await updateDoc(currentUserRef, {
                  displayName: updatedDisplayName,
                  photoURL: downloadURL,
                });
              });
            }
          );
          updateProfileForOthers();
        }
        closeProfile();
        navigate("/")
      } catch (error) {
        console.log(error.message);
        setUpdateError("Failed to update profile !");
      }
    };


    const closeProfile = () => {
      setIsEditing(false);
      setisProfileOpen(false);
      setIsDropdownOpen(false);
    };


    const closeEditor = () => {
      setUpdatedDisplayName(currentUser.displayName);
      setUpdatedEmail(currentUser.email);
      setUpdatedProfileImage(null);
      setUpdatedPassword("");
      setUpdateError(false);
      setIsEditing(false);
    };


  return (
    <div className="relative w-screen h-screen top-0 left-0 sm:w-1/3 lg:w-1/4 inset-0 shadow-lg bg-regal-blue flex flex-col p-3 gap-2overflow-hidden">
      <div className="flex justify-center items-center mt-3 ">
        <FiArrowLeft
          className="absolute left-4 top-7 w-7 h-7 text-gray-200 cursor-pointer"
          onClick={closeProfile}
        />
        <h1 className="text-3xl text-white text-center">Profile</h1>
      </div>
      <div className="flex flex-col ">
        <div className="mt-7 flex flex-col justify-center items-center">
          <img
            src={currentUser.photoURL}
            onClick={openFullScreen}
            alt={avatar}
            id="dp"
            className="w-48 h-48 rounded-full cursor-pointer lg:w-52 lg:h-52 "
          />
          <label htmlFor="avatar" className="flex mt-3">
            {isEditing &&
              (currentUser.photoURL ? (
                <p className="text-white text-xl cursor-pointer">
                  Update Avatar
                </p>
              ) : (
                <p className="text-white text-xl cursor-pointer">
                  Upload Avatar
                </p>
              ))}
          </label>
          <input
            onChange={(e) => setUpdatedProfileImage(e.target.files[0])}
            type="file"
            id="avatar"
            className="invisible w-0 h-0"
          />
        </div>
        <div className="flex flex-col justify-start ml-5 mb-3">
          <h3 className="text-white font-bold mb-1">Name</h3>
          {isEditing ? (
            <input
              type="text"
              value={updatedDisplayName}
              className="bg-transparent font-normal text-lg text-gray-200 p-2"
              onChange={(e) => setUpdatedDisplayName(e.target.value)}
              minLength={3}
            />
          ) : (
            <p className="text-gray-300 text-lg">{currentUser.displayName}</p>
          )}
        </div>
        <div className="flex flex-col justify-start ml-5 mb-3">
          <h3 className="text-white font-bold mb-1">Email</h3>
          {isEditing ? (
            <input
              type="email"
              value={updatedEmail}
              className="bg-transparent font-normal text-lg text-gray-200 p-2"
              onChange={(e) => setUpdatedEmail(e.target.value)}
            />
          ) : (
            <p className="text-gray-300 text-lg">{currentUser.email}</p>
          )}
        </div>
        {isEditing && (
          <div className="flex flex-col justify-start ml-5 mb-3">
            <h3 className="text-white font-bold mb-1">New Password</h3>
              <input
                type="password"
                value={updatedPassword}
                className="bg-transparent  font-normal text-lg text-gray-200 p-2"
                onChange={(e) => setUpdatedPassword(e.target.value)}
                placeholder="Enter New Password"
                minLength={6}
              />
          </div>
        )}
        {isEditing && updateError && (
          <p className="text-center text-red-500">{updateError}</p>
        )}
        <div className="flex justify-center items-center mt-4">
          {isEditing ? (
            <div className="flex justify-between items-center">
              <button
                onClick={closeEditor}
                className="flex justify-center items-center mr-7 text-white w-fit rounded bg-shadyblue py-2 px-4 hover:bg-darkblue hover:border"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                className="flex justify-center items-center ml-7 text-white w-fit rounded bg-shadyblue py-2 px-4 hover:bg-darkblue hover:border"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex justify-center items-center text-white w-fit rounded bg-shadyblue py-2 px-4 hover:bg-darkblue hover:border"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
