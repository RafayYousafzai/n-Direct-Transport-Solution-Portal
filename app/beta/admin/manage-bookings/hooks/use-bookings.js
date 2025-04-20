import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  startAfter,
  limit,
  orderBy,
} from "firebase/firestore";
import { db } from "@/api/firebase/config"; // Assuming your Firebase config is here

const ITEMS_PER_PAGE = 50; // You can adjust the number of items per page

const useFirebasePaginatedCollection = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const fetchFirstPage = async () => {
    setLoading(true);
    setError(null);
    try {
      const first = query(
        collection(db, collectionName),
        orderBy("createdAt"),
        limit(ITEMS_PER_PAGE)
      ); // Assuming 'createdAt' for ordering
      const documentSnapshots = await getDocs(first);

      if (!documentSnapshots.empty) {
        const newData = documentSnapshots.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(newData);
        setLastVisible(
          documentSnapshots.docs[documentSnapshots.docs.length - 1]
        );
        setFirstVisible(documentSnapshots.docs[0]);
        setHasNextPage(documentSnapshots.docs.length === ITEMS_PER_PAGE);
        setHasPreviousPage(false);
      } else {
        setData([]);
        setLastVisible(null);
        setFirstVisible(null);
        setHasNextPage(false);
        setHasPreviousPage(false);
      }
    } catch (err) {
      setError(err.message);
      setData([]);
      setLastVisible(null);
      setFirstVisible(null);
      setHasNextPage(false);
      setHasPreviousPage(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchNextPage = async () => {
    if (!lastVisible) return;
    setLoading(true);
    setError(null);
    try {
      const next = query(
        collection(db, collectionName),
        orderBy("createdAt"),
        startAfter(lastVisible),
        limit(ITEMS_PER_PAGE)
      );
      const documentSnapshots = await getDocs(next);

      if (!documentSnapshots.empty) {
        const newData = documentSnapshots.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(newData);
        setLastVisible(
          documentSnapshots.docs[documentSnapshots.docs.length - 1]
        );
        setFirstVisible(documentSnapshots.docs[0]);
        setHasNextPage(documentSnapshots.docs.length === ITEMS_PER_PAGE);
        setHasPreviousPage(true);
      } else {
        setLastVisible(null);
        setHasNextPage(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreviousPage = async () => {
    if (!firstVisible) return;
    setLoading(true);
    setError(null);
    try {
      // To go back, we need to fetch the previous 'ITEMS_PER_PAGE' documents before the current firstVisible.
      // Firestore doesn't directly support 'startBefore' with a limit going backward efficiently.
      // A common workaround is to fetch the required number of documents and then reverse the order.
      const previousQuery = query(
        collection(db, collectionName),
        orderBy("createdAt", "desc"), // Order in reverse
        startAfter(lastVisible), // Start after the last visible of the previous page
        limit(ITEMS_PER_PAGE)
      );
      const previousSnapshots = await getDocs(previousQuery);

      if (!previousSnapshots.empty) {
        const reversedData = previousSnapshots.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .reverse();
        setData(reversedData);
        setLastVisible(
          previousSnapshots.docs[previousSnapshots.docs.length - 1]
        );
        setFirstVisible(previousSnapshots.docs[0]);
        setHasPreviousPage(previousSnapshots.docs.length === ITEMS_PER_PAGE);
        setHasNextPage(true);

        // A more efficient way to handle going back multiple pages would involve storing previous cursors.
        // For simplicity, this implementation fetches the previous page.
        const priorToFirst = query(
          collection(db, collectionName),
          orderBy("createdAt", "desc"),
          startAfter(firstVisible),
          limit(ITEMS_PER_PAGE)
        );
        const priorToFirstSnapshots = await getDocs(priorToFirst);
        if (!priorToFirstSnapshots.empty) {
          setLastVisible(
            priorToFirstSnapshots.docs[priorToFirstSnapshots.docs.length - 1]
          );
        } else {
          setLastVisible(null); // Reached the beginning
        }
      } else {
        setFirstVisible(null);
        setHasPreviousPage(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  return {
    data,
    loading,
    error,
    hasNextPage,
    hasPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
  };
};

export default useFirebasePaginatedCollection;
