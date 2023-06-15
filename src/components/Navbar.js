import { signOut, updateProfile } from "firebase/auth";
import React, { useContext, useState } from "react";
import { auth, db, storage } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { FiArrowLeft, FiMoreVertical } from "react-icons/fi";
import { deleteObject, getDownloadURL, getMetadata, ref, updateMetadata, uploadBytesResumable } from "firebase/storage";
import { doc, updateDoc, getDocs, collection } from "firebase/firestore";
import avatar from "../images/avatar.png";


const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatContext);
  const [isEditing, setIsEditing] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [isProfileOpen, setisProfileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [updatedDisplayName, setUpdatedDisplayName] = useState(currentUser.displayName);
  const [updatedProfileImage, setUpdatedProfileImage] = useState(null);

  const openFullScreen = () => {
    document.getElementById("dp")?.requestFullscreen();
  };

  const updateProfileForOthers = async () => {
    console.log(`updateProfileForOthers called`);
    const q = collection(db, "userChats");
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (document) => {
      const data = document.data();
      const fieldIds = Object.keys(data);
      fieldIds.forEach(async (fieldId) => {
        const userInfo = data[fieldId].userInfo;
        if (userInfo?.uid === currentUser.uid) {
          console.log(`Match found for current user `);
          const updatedData = {
            [`${fieldId}.userInfo.uid`]: currentUser.uid,
            [`${fieldId}.userInfo.displayName`]: updatedDisplayName,
            [`${fieldId}.userInfo.photoURL`]: updatedProfileImage
              ? updatedProfileImage
              : currentUser.photoURL,
          };
          await updateDoc(doc(db, "userChats", document.id), updatedData);
          console.log(`Updated Profile in other chats `);
        }
      });
    });
  };

  const handleUpdateProfile = async () => {
    try {
      const currentUserRef = doc(db, "users", currentUser.uid);
      // Update old avatar name if display name has changed
      if ( !updatedProfileImage && updatedDisplayName !== currentUser.displayName) {
        console.log(`Only display name is updating but not image`);
        const newStorageRef = ref(storage, currentUser.displayName);
        try {
          const metadata = await getMetadata(newStorageRef);
          console.log(`old meta data : `, metadata);
          const newMetaData = {
            fullPath: updatedDisplayName,
            name: updatedDisplayName,
          };
          await updateMetadata(newStorageRef, newMetaData);
          console.log(`Metadata updated successfully`);
        } catch (error) {
          console.log(`Error updating metadata: `, error.message);
        }
        await updateProfile(currentUser, {
          displayName: updatedDisplayName,
        }).then(console.log(`Profile updated with new displayname entered`));
        await updateDoc(currentUserRef, {
          displayName: updatedDisplayName,
        }).then(console.log(`User Doc updated with new displayname entered`));

        updateProfileForOthers();
        dispatch({
          type: "UPDATE_PROFILE",
          payload: {
            uid: currentUser.uid,
            displayName: updatedDisplayName,
            photoURL: currentUser.photoURL,
          },
        });
        closeProfile();
      }
      // Update the profile image and/or display name
      else if (updatedProfileImage) {
        console.log(`Image is selected and displayname may be edited`);
        const oldStorageRef = ref(storage, currentUser.displayName);
        console.log(`Old Image Reference Found : `, oldStorageRef);
        if (oldStorageRef) {
          deleteObject(oldStorageRef);
          console.log(`Old Image Reference Deleted`);
        } else {
          console.log(`Old Image Reference Not Found`);
        }
        const newStorageRef = ref(storage, updatedDisplayName);
        const uploadTask = uploadBytesResumable(
          newStorageRef,
          updatedProfileImage
        );
        uploadTask.on(
          (error) => {
            console.log(error.message);
            setUpdateError("Failed to upload new avatar");
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                await updateProfile(currentUser, {
                  displayName: updatedDisplayName,
                  photoURL: downloadURL,
                }).then(
                  console.log(
                    `Profile updated with new image and displayname entered`
                  )
                );
                await updateDoc(currentUserRef, {
                  displayName: updatedDisplayName,
                  photoURL: downloadURL,
                }).then(
                  console.log(
                    `User Doc in the users collection updated with new image and displayname entered`
                  )
                );
                console.log("New Avatar:", downloadURL);
                console.log("New Name:", updatedDisplayName);
              }
            );
          }
        );
        updateProfileForOthers();
        dispatch({
          type: "UPDATE_PROFILE",
          payload: {
            uid: currentUser.uid,
            displayName: updatedDisplayName,
            photoURL: updatedProfileImage,
          },
        });
        closeProfile();
      }
    } catch (error) {
      console.log(error.message);
      setUpdateError("Failed to update profile!");
    }
  };

  const closeProfile = () => {
    setisProfileOpen(false);
    setIsEditing(false);
    setIsDropdownOpen(false);
  };

  const closeEditor = () => {
    setUpdatedDisplayName(currentUser.displayName);
    setUpdatedProfileImage(null);
    setUpdateError(false);
    setIsEditing(false);
  };

  const Logout = () => {
    dispatch({ type: "REMOVE_USER", payload: data?.user });
    signOut(auth);
  };

  return isProfileOpen ? (
    <div className="relative h-screen top-0 left-0 sm:w-1/3 lg:w-1/4 inset-0 shadow-lg bg-regal-blue flex flex-col p-3 gap-2  overflow-hidden">
      <div className="flex justify-center items-center mt-3 ">
        <FiArrowLeft
          className="absolute left-4 top-7 w-7 h-7 text-gray-200 cursor-pointer"
          onClick={closeProfile}
        />
        <h1 className="text-3xl text-white text-center">Profile</h1>
      </div>
      <div className="flex flex-col ">
        <div className="my-7 flex flex-col  justify-center items-center">
          <img
            src={currentUser.photoURL}
            onClick={openFullScreen}
            alt={avatar}
            id="dp"
            className="w-44 h-44 rounded-full cursor-pointer sm:w-48 sm:h-48 "
          />
          <label htmlFor="avatar" className="flex mt-5">
            {isEditing && (
              currentUser.photoURL ? <p className="text-white cursor-pointer">Update Avatar</p> 
              : <p className="text-white cursor-pointer">Upload Avatar</p>
            )}
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
              className="bg-transparent font-normal text-white p-2"
              onChange={(e) => setUpdatedDisplayName(e.target.value)}
              minLength={3}
            />
          ) : (
            <p className="text-white">{currentUser.displayName}</p>
          )}
        </div>
        {!isEditing && (
          <div className="flex flex-col justify-start ml-5 mb-3">
            <h3 className="text-white font-bold mb-1">Email</h3>
            <span className="font-normal text-white  ml-2">
              {currentUser.email}
            </span>
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
  ) : (
    <header className="relative top-0 left-0 sm:w-1/3 lg:w-1/4  inset-x-0 shadow-lg bg-regal-blue flex items-center justify-between p-3 gap-2 ">
      <div className="flex">
        <h1 className="text-white font-medium text-2xl text-start top-0 left-0 ml-0">
          VChat
        </h1>
      </div>
      <ul className="flex flex-row justify-center items-center">
        <li>
          <img
            src={currentUser.photoURL}
            onClick={openFullScreen}
            alt={avatar}
            id="dp"
            className="w-9 h-9 mr-3 rounded-full cursor-pointer sm:w-10 sm:h-10"
          />
        </li>
        <li>
          <span className="font-bold text-white mt-2 sm:text-2xL lg:text-2xl lg:font-normal">
            {currentUser.displayName}
          </span>
        </li>
        <li>
          <FiMoreVertical
            className="text-white w-7 h-7 mt-1 ml-2 cursor-pointer md:ml-3"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />
        </li>
        {isDropdownOpen && (
          <div className="absolute z-50 right-1 top-16 py-2 w-40 bg-darkblue rounded shadow-lg">
            <ul>
              <li
                className="px-4 py-2 text-white hover:bg-regal-blue cursor-pointer"
                onClick={() => setisProfileOpen(true)}
              >
                Profile
              </li>
              <li
                className="px-4 py-2 text-white hover:bg-regal-blue cursor-pointer"
                onClick={() => Logout()}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </ul>
    </header>
  );
};

export default Navbar;
