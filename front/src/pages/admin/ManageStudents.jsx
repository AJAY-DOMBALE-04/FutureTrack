// ✅ src/pages/admin/ManageStudents.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../firebase";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [filterBranch, setFilterBranch] = useState("");
  const [filterRoll, setFilterRoll] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null); // ✅ Track which image is zoomed

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);

      const studentData = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.role === "student");

      setStudents(studentData);
      setError(null);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to fetch students from Firebase.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId, photoUrl) => {
    if (!window.confirm("Are you sure you want to delete this student permanently?")) return;
    try {
      await deleteDoc(doc(db, "users", studentId));
      if (photoUrl) {
        try {
          const photoRef = ref(storage, photoUrl);
          await deleteObject(photoRef);
        } catch (photoErr) {
          console.warn("Photo deletion failed:", photoErr);
        }
      }
      alert("Student deleted successfully!");
      fetchStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
      setError("Failed to delete student.");
    }
  };

  const toggleZoom = (id) => {
    setZoomedImage(zoomedImage === id ? null : id);
  };

  const filteredStudents = students.filter((student) => {
    const branchMatch = student.branch?.toLowerCase().includes(filterBranch.toLowerCase());
    const rollMatch = student.rollNumber?.toLowerCase().includes(filterRoll.toLowerCase());
    const nameMatch = student.displayName?.toLowerCase().includes(filterName.toLowerCase());
    const emailMatch = student.collegeEmail?.toLowerCase().includes(filterEmail.toLowerCase());
    return branchMatch && rollMatch && nameMatch && emailMatch;
  });

  if (loading) return <div className="manage-students-container">Loading students...</div>;
  if (error) return <div className="manage-students-container error-message">{error}</div>;

  return (
    <>
      <style>{`
        body {
          font-family: 'Inter', sans-serif;
          background-color: #f4f7f6;
          margin: 0;
          padding: 0;
          color: #333;
        }

        .manage-students-container {
          max-width: 1000px;
          margin: 40px auto;
          padding: 30px;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .error-message {
          color: #dc3545;
          font-weight: 500;
          text-align: center;
        }

        .manage-students-title {
          text-align: center;
          color: #1a2b4b;
          margin-bottom: 30px;
          font-size: 2.2em;
          font-weight: 700;
        }

        .filter-section {
          margin-bottom: 30px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          text-align: left;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
        }

        .filter-group label {
          font-size: 1em;
          color: #555;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .filter-input {
          padding: 10px 15px;
          border: 1px solid #ced4da;
          border-radius: 5px;
          font-size: 1em;
        }

        .student-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
        }

        @media (max-width: 768px) {
          .student-list { grid-template-columns: 1fr; }
        }

        .student-card {
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: transform 0.2s ease-in-out;
        }

        .student-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.1);
        }

        .profile-image-container {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 20px;
          border: 3px solid #16a34a;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e9ecef;
          flex-shrink: 0;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        /* ✅ Zoomed image effect */
        .profile-image-container.zoomed {
          transform: scale(1.4);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
          z-index: 5;
        }

        .profile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .student-details {
          flex-grow: 1;
        }

        .student-name {
          font-size: 1.3em;
          font-weight: 600;
          color: #343a40;
          margin: 0 0 5px 0;
        }

        .student-roll,
        .student-email,
        .student-branch {
          font-size: 0.9em;
          color: #6c757d;
          margin: 3px 0;
        }

        .student-branch {
          font-weight: 500;
          color: #16a34a;
        }

        .delete-button {
          background-color: #fee2e2;
          color: #991b1b;
          border: none;
          padding: 8px 12px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 600;
          margin-left: 15px;
        }

        .delete-button:hover { background-color: #fecaca; }
      `}</style>

      <div className="manage-students-container">
        <h2 className="manage-students-title">Manage Students</h2>

        {/* Filters */}
        <div className="filter-section">
          <div className="filter-group">
            <label>Search by Branch:</label>
            <input
              type="text"
              className="filter-input"
              placeholder="e.g., Computer Science"
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Search by Roll Number:</label>
            <input
              type="text"
              className="filter-input"
              placeholder="e.g., CS001"
              value={filterRoll}
              onChange={(e) => setFilterRoll(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Search by Name:</label>
            <input
              type="text"
              className="filter-input"
              placeholder="e.g., Ajay"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Search by Email:</label>
            <input
              type="text"
              className="filter-input"
              placeholder="e.g., student@college.edu"
              value={filterEmail}
              onChange={(e) => setFilterEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="student-list">
          {filteredStudents.length === 0 ? (
            <p style={{ textAlign: "center" }}>
              No students found matching your criteria.
            </p>
          ) : (
            filteredStudents.map((student) => {
              const imageUrl =
                student.profilePhotoUrl ||
                `https://api.dicebear.com/8.x/initials/svg?seed=${
                  student.displayName || "User"
                }`;

              return (
                <div key={student.id} className="student-card">
                  <div
                    className={`profile-image-container ${
                      zoomedImage === student.id ? "zoomed" : ""
                    }`}
                    onClick={() => toggleZoom(student.id)}
                  >
                    <img
                      src={imageUrl}
                      alt={`${student.displayName}'s profile`}
                      className="profile-image"
                    />
                  </div>
                  <div className="student-details">
                    <h3 className="student-name">{student.displayName || "N/A"}</h3>
                    <p className="student-roll">
                      Roll No: {student.rollNumber || "N/A"}
                    </p>
                    <p className="student-email">
                      Email: {student.collegeEmail}
                    </p>
                    <p className="student-branch">
                      Branch: {student.branch}
                    </p>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDelete(student.id, student.profilePhotoUrl)
                    }
                  >
                    Delete
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default ManageStudents;
