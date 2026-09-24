import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getBusinessInfo,
  updateBusinessInfo,
  getContactInfo,
  updateContactInfo,
  getAlbums,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addPhotoToAlbum,
  deletePhotoFromAlbum,
  addVideoToAlbum,
  deleteVideoFromAlbum,
  getReviews,
  addCustomerReview,
  updateReview,
  deleteReview,
  getSettings,
  updateSettings,
  syncLocalAlbumsToSupabase
} from "../services/dataService";
import {
  initialBusinessData,
  initialContactData,
  initialAlbumsData,
  initialReviewsData,
  initialSettingsData
} from "../config/defaultData";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [businessData, setBusinessData] = useState(() => {
    try {
      const saved = localStorage.getItem("future_events_business_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profileImage && parsed.profileImage.includes("unsplash.com")) {
          parsed.profileImage = "";
        }
        return parsed;
      }
    } catch {}
    return initialBusinessData;
  });

  const [contactData, setContactData] = useState(() => {
    try {
      const saved = localStorage.getItem("future_events_contact_data");
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialContactData;
  });

  const [albums, setAlbums] = useState(() => {
    try {
      const saved = localStorage.getItem("future_events_albums");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(a => ({
            ...a,
            photos: (a.photos || []).filter(p => p.url && !p.url.includes("unsplash.com")),
            thumbnail: (a.thumbnail && !a.thumbnail.includes("unsplash.com")) ? a.thumbnail : ""
          }));
        }
      }
    } catch {}
    return initialAlbumsData;
  });

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem("future_events_reviews");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(r => ({
            ...r,
            photos: (r.photos || []).filter(p => typeof p === "string" ? !p.includes("unsplash.com") : !p.url?.includes("unsplash.com"))
          }));
        }
      }
    } catch {}
    return initialReviewsData;
  });

  const [settings, setSettings] = useState(initialSettingsData);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAllData = async () => {
    try {
      const [biz, contact, albs, revs, sett] = await Promise.all([
        getBusinessInfo(),
        getContactInfo(),
        getAlbums(),
        getReviews(),
        getSettings()
      ]);
      if (biz) setBusinessData(biz);
      if (contact) setContactData(contact);
      if (albs) setAlbums(albs);
      if (revs) setReviews(revs);
      if (sett) setSettings(sett);
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();

    // Listen for cross-component and local updates
    const handleDataChange = () => {
      refreshAllData();
    };

    window.addEventListener("future_events_data_change", handleDataChange);
    return () => {
      window.removeEventListener("future_events_data_change", handleDataChange);
    };
  }, []);

  // Handlers for easy calling across UI
  const handleUpdateBusiness = async (newData) => {
    const res = await updateBusinessInfo(newData);
    setBusinessData(res);
    return res;
  };

  const handleUpdateContact = async (newData) => {
    const res = await updateContactInfo(newData);
    setContactData(res);
    return res;
  };

  const handleCreateAlbum = async (albumData) => {
    const res = await createAlbum(albumData);
    await refreshAllData();
    return res;
  };

  const handleUpdateAlbum = async (albumId, albumData) => {
    const res = await updateAlbum(albumId, albumData);
    await refreshAllData();
    return res;
  };

  const handleDeleteAlbum = async (albumId) => {
    const res = await deleteAlbum(albumId);
    await refreshAllData();
    return res;
  };

  const handleAddPhoto = async (albumId, photo) => {
    const res = await addPhotoToAlbum(albumId, photo);
    await refreshAllData();
    return res;
  };

  const handleDeletePhoto = async (albumId, photoId) => {
    const res = await deletePhotoFromAlbum(albumId, photoId);
    await refreshAllData();
    return res;
  };

  const handleAddVideo = async (albumId, video) => {
    const res = await addVideoToAlbum(albumId, video);
    await refreshAllData();
    return res;
  };

  const handleDeleteVideo = async (albumId, videoId) => {
    const res = await deleteVideoFromAlbum(albumId, videoId);
    await refreshAllData();
    return res;
  };

  const handleAddCustomerReview = async (reviewData) => {
    const res = await addCustomerReview(reviewData);
    await refreshAllData();
    return res;
  };

  const handleUpdateReview = async (reviewId, updateData) => {
    const res = await updateReview(reviewId, updateData);
    await refreshAllData();
    return res;
  };

  const handleDeleteReview = async (reviewId) => {
    const res = await deleteReview(reviewId);
    await refreshAllData();
    return res;
  };

  const handleUpdateSettings = async (newSettings) => {
    const res = await updateSettings(newSettings);
    setSettings(res);
    return res;
  };

  const handleSyncToSupabase = async (onProgress) => {
    const res = await syncLocalAlbumsToSupabase(onProgress);
    await refreshAllData();
    return res;
  };

  return (
    <DataContext.Provider
      value={{
        isLoading,
        businessData,
        contactData,
        albums,
        reviews,
        settings,
        refreshAllData,
        updateBusiness: handleUpdateBusiness,
        updateContact: handleUpdateContact,
        createAlbum: handleCreateAlbum,
        updateAlbum: handleUpdateAlbum,
        deleteAlbum: handleDeleteAlbum,
        addPhotoToAlbum: handleAddPhoto,
        deletePhotoFromAlbum: handleDeletePhoto,
        addVideoToAlbum: handleAddVideo,
        deleteVideoFromAlbum: handleDeleteVideo,
        syncLocalAlbumsToSupabase: handleSyncToSupabase,
        addCustomerReview: handleAddCustomerReview,
        updateReview: handleUpdateReview,
        deleteReview: handleDeleteReview,
        updateSettings: handleUpdateSettings
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
}
