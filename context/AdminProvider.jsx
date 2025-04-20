import { app } from "@/api/firebase/config";
import {
  collection,
  doc,
  getFirestore,
  query,
  onSnapshot,
  limit,
  startAfter,
  orderBy,
  getCountFromServer,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext();

const useAdminContext = () => useContext(AdminContext);
export const db = getFirestore(app);

const AdminProvider = ({ children }) => {
  const [allBookings, setAllBookings] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);
  const [allArchivedAccounts, setArchivedAccounts] = useState([]);
  const [lastBookingDoc, setLastBookingDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [priceSettings, setPriceSettings] = useState(null);
  const [chats, setChats] = useState(null);

  const [totalBookings, setTotalBookings] = useState(0);
  const BOOKINGS_LIMIT = 0;

  const fetchDocumentCounts = async () => {
    try {
      const bookingsRef = collection(db, "place_bookings");
      const bookingsSnapshot = await getCountFromServer(query(bookingsRef));
      setTotalBookings(bookingsSnapshot.data().count);
    } catch (error) {
      console.error("Error counting documents:", error);
    }
  };

  const fetchBookingsWithPagination = (isInitial = false) => {
    setIsLoading(true);
    try {
      const bookingsRef = collection(db, "place_bookings");
      let bookingsQuery = query(
        bookingsRef,
        orderBy("createdAt", "desc"),
        limit(BOOKINGS_LIMIT)
      );

      if (!isInitial && lastBookingDoc) {
        bookingsQuery = query(bookingsQuery, startAfter(lastBookingDoc));
      }

      const unsubscribe = onSnapshot(bookingsQuery, (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() });
        });

        if (querySnapshot.docs.length > 0) {
          setLastBookingDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        }

        setAllBookings(documents);
        setIsLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setIsLoading(false);
    }
  };

  const fetchUsers = () => {
    setIsLoading(true);
    try {
      const usersRef = collection(db, "users");
      const usersQuery = query(usersRef);

      const unsubscribeUsers = onSnapshot(usersQuery, (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() });
        });

        setAllUsers(documents.filter((user) => user.role !== "archived"));
        setAllDrivers(documents.filter((user) => user.role === "driver"));
        setArchivedAccounts(
          documents.filter((user) => user.role === "archived")
        );
        setIsLoading(false);
      });

      return unsubscribeUsers;
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsLoading(false);
    }
  };

  const fetchChats = () => {
    setIsLoading(true);
    try {
      const unsubscribeUsers = onSnapshot(
        query(collection(db, "chats")),
        (querySnapshot) => {
          const documents = [];
          querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
          });
          setChats(documents);
        }
      );

      return unsubscribeUsers;
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch price settings with real-time updates
  const fetchPriceSettings = () => {
    try {
      const priceSettingsRef = doc(db, "data", "price_settings");

      const unsubscribePriceSettings = onSnapshot(
        priceSettingsRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            setPriceSettings(docSnapshot.data());
          } else {
            console.log("Price settings document does not exist.");
          }
        }
      );

      return unsubscribePriceSettings;
    } catch (error) {
      console.error("Error fetching price settings:", error);
    }
  };

  useEffect(() => {
    // Initial fetch for bookings and users
    const unsubscribeBookings = fetchBookingsWithPagination(false);
    const unsubscribeUsers = fetchUsers();
    const unsubscribePriceSettings = fetchPriceSettings();
    const unsubscribeChats = fetchChats();
    fetchDocumentCounts();

    // Clean up listeners on component unmount
    return () => {
      if (unsubscribeBookings) unsubscribeBookings();
      if (unsubscribeUsers) unsubscribeUsers();
      if (unsubscribePriceSettings) unsubscribePriceSettings();
      if (unsubscribeChats) unsubscribeChats();
    };
  }, []);

  const archivedBookings = allBookings.filter(
    (item) => item?.isArchived === true
  );
  const unArchivedBookings = allBookings.filter(
    (item) => item?.isArchived !== true
  );

  return (
    <AdminContext.Provider
      value={{
        allBookings: unArchivedBookings,
        allUsers,
        allDrivers,
        allArchivedAccounts,
        fetchNextBookingsPage: () => fetchBookingsWithPagination(false),
        isLoading,
        totalBookings,
        archivedBookings,
        priceSettings,
        chats,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export { AdminProvider };
export default useAdminContext;
