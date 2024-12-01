import React, { useState } from "react";
import UserForm from "./UserForm";
import "./App.css";
import { Userschema, UserInterface } from "./types";

const userFields: Userschema[] = [
  {
    field_name: "id",
    display_name: "User Id",
    type: "number",
    required: false,
  },
  {
    field_name: "first_name",
    display_name: "First Name",
    type: "string",
    required: false,
  },
  {
    field_name: "last_name",
    display_name: "Last Name",
    type: "string",
    required: false,
  },
  {
    field_name: "name",
    display_name: "Name",
    type: "string",
    required: true,
  },
  {
    field_name: "email",
    display_name: "Email",
    type: "string",
    required: true,
  },
];

const App: React.FC = () => {
  const [view, setViewType] = useState<string>("list");
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editingUser, setEditingUser] = useState<UserInterface | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  const filteredUsers = users.filter((user) => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    return userFields.some((field) =>
      String(user[field.field_name] ?? "")
        .toLowerCase()
        .includes(lowerSearchQuery)
    );
  });

  const sortUsers = (column: keyof UserInterface) => {
    const newSortOrder =
      sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newSortOrder);

    const sortedUsers = [...users].sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];
      if (typeof valueA === "string" && typeof valueB === "string") {
        return newSortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      if (typeof valueA === "number" && typeof valueB === "number") {
        return newSortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }
      return 0;
    });

    setUsers(sortedUsers);
  };

  const handleSave = (user: UserInterface) => {
    if (editingUser) {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? user : u))
      );
    } else {
      setUsers((prevUsers) => [...prevUsers, { ...user, id: Date.now() }]);
    }
    setEditingUser(null);
    setViewType("list");
  };

  const handleEdit = (user: UserInterface) => {
    setEditingUser(user);
    setViewType("edit");
  };

  const handleDelete = (id: number) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  const addUserButton = (
    <button onClick={() => setViewType("add")}> + Add User</button>
  );

  return (
    <div className="container">
      {view === "list" && (
        <>
          <div>
            <h1>User Management</h1>
            {users.length > 0 && (
              <div className="controls">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                {addUserButton}
              </div>
            )}
          </div>
          {users.length > 0 && (
            <table>
              <thead>
                <tr>
                  {userFields.map((field) => (
                    <th
                      key={field.field_name}
                      onClick={() => sortUsers(field.field_name)}
                    >
                      {field.display_name}{" "}
                      {sortColumn === field.field_name
                        ? sortOrder === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 &&
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      {userFields.map((field) => (
                        <td key={field.field_name}>
                          {String(user[field.field_name] ?? "")}
                        </td>
                      ))}
                      <td>
                        <button
                          className="edit"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td className="norecord" colSpan={userFields.length + 1}>
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          {users.length === 0 && (
            <div className="empty_message_wrap">
              <div className="empty_message">{addUserButton}</div>
            </div>
          )}
        </>
      )}
      {view === "add" || view === "edit" ? (
        <UserForm
          fields={userFields}
          user={editingUser}
          onSave={handleSave}
          onCancel={() => setViewType("list")}
        />
      ) : null}
    </div>
  );
};

export default App;
