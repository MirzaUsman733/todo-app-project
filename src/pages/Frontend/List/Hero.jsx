import React from 'react';
import { useParams } from 'react-router-dom';
import { useLists } from 'contexts/ListsContext';
import { useStickyNotes } from 'contexts/StickyNotesContext';

export default function Hero() {
  const param = useParams();
  const ListId = param.id;

  const { lists } = useLists(); 
  const { stickyNotes } = useStickyNotes();


  const selectedList = lists.find((list) => list.listId === ListId);
  const filteredStickyNotes = stickyNotes.filter((stickyNote) => {
    return stickyNote.status === selectedList?.name;
  });

  return (
    <div>
      <div>
        <div className="container">
          <ul className="row">
            {filteredStickyNotes?.map((stickyNote) => (
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
    </div>
  );
}






















// import React, { useCallback, useEffect, useState } from 'react'
// import { firestore } from 'config/firebase';
// import { useAuthContext } from 'contexts/AuthContext';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { useParams } from 'react-router-dom'

// export default function Hero() {
//   const param = useParams();
//   const ListId = param.id;

//   const {user} = useAuthContext();
//   const [stickyNotes, setStickyNotes] = useState([]);
//   const [lists,setLists] = useState("")
//   const getList = useCallback(async()=>{
//     const q = query(
//       collection(firestore, 'lists'),
//       where("listId", "==" , ListId),
      
//       );

//     const querySnapshot = await getDocs(q);

//     querySnapshot.docs.map((doc) => setLists(doc.data().name));
//   },[ListId])  

    
  

//   const getSticky = useCallback( async () => {
//     console.log(lists)
//     const q = query(
//       collection(firestore, 'sticky'),
//       where('status', '==', lists),
//       where("createdBy.uid", "==", user.uid)
//     );

//     const querySnapshot = await getDocs(q);

//     const stickyNotesData = querySnapshot.docs.map((doc) => doc.data());
//     setStickyNotes(stickyNotesData);
//   },[user.uid,lists]
//   )
//   useEffect(() => {
//     getList()
//   }, [getList]);
//   useEffect(()=>{
//     getSticky()
//   },[getSticky])
// // console.log(stickyNotes)
//   return (
//     <div>
//        <div>
//       <div className="container">
//         <ul className="row">
//           {stickyNotes?.map((stickyNote) => (
//             <li
//               className="col-4"
//               style={{ listStyleType: 'none' }}
//               key={stickyNote.id}
//             >
//               <div
//                 className="stick"
//                 style={{
//                   backgroundColor: stickyNote.color || '#F8F9FA',
//                   padding: '10px',
//                   marginBottom: '10px',
//                   borderRadius: '10px',
//                   height: '250px',
//                 }}
//               >
//                 <div
//                   style={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                   }}
//                 >
//                   <h4>{stickyNote.title}</h4>
//                   <div className="dropdown">
//                     <div className="dropdown-toggle">⋮</div>
//                     <div className="dropdown-content text-center">
//                       {/* <button
//                         className="edit border border-0 btn btn-primary"
//                         data-bs-toggle="modal"
//                         data-bs-target="#exampleModal"
//                         onClick={() => handleEdit(stickyNote.id)}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="delete border border-0 btn btn-danger"
//                         onClick={() => handleDelete(stickyNote.id)}
//                       >
//                         Delete
//                       </button> */}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="stickyDescription">
//                   <p>{stickyNote.description}</p>
//                 </div>
//                 <p>
//                   {/* {new Date(
//                     stickyNote.dateCreated.seconds * 1000
//                   ).toLocaleString()} */}
//                   {stickyNote.dateCreated?.seconds &&
//                     new Date(
//                       stickyNote.dateCreated.seconds * 1000
//                     ).toLocaleString()}
//                 </p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//     </div>
//   )
// }
