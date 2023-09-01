import { firestore } from 'config/firebase';
import { useAuthContext } from 'contexts/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useCallback } from 'react';

export default function Hero() {
  const {user} = useAuthContext();
  const [stickyNotes, setStickyNotes] = useState([]);

  const getSticky = useCallback( async () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const q = query(
      collection(firestore, 'sticky'),
      where('date', '==', currentDate),
      where("createdBy.uid", "==", user.uid)
    );

    const querySnapshot = await getDocs(q);

    const stickyNotesData = querySnapshot.docs.map((doc) => doc.data());
    setStickyNotes(stickyNotesData);
  },[user.uid]
  )

  useEffect(() => {
    getSticky();
  }, [getSticky]);

  return (
    <div>
      <div className="container">
        <ul className="row">
          {stickyNotes?.map((stickyNote) => (
            <li
              className="col-4"
              style={{ listStyleType: 'none' }}
              key={stickyNote.id}
            >
              <div
                className="stick"
                style={{
                  backgroundColor: stickyNote.color || '#F8F9FA',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '10px',
                  height: '250px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <h4>{stickyNote.title}</h4>
                  <div className="dropdown">
                    <div className="dropdown-toggle">⋮</div>
                    <div className="dropdown-content text-center">
                      {/* <button
                        className="edit border border-0 btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onClick={() => handleEdit(stickyNote.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete border border-0 btn btn-danger"
                        onClick={() => handleDelete(stickyNote.id)}
                      >
                        Delete
                      </button> */}
                    </div>
                  </div>
                </div>
                <div className="stickyDescription">
                  <p>{stickyNote.description}</p>
                </div>
                <p>
                  {stickyNote.dateCreated?.seconds &&
                    new Date(
                      stickyNote.dateCreated.seconds * 1000
                    ).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
