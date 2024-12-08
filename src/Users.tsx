import React, { useState, useMemo } from "react";
import CustomForm from "./Components/Form";
import ListComponent from "./Components/ListComponent";
import { Userschema, UserInterface } from "./types";
import "./Users.css";
import { Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const defaultDataRecord = (): UserInterface => ({
  id: 0,
  first_name: "",
  last_name: "",
  name: "",
  email: "",
});

const moduleName = "Users Management";

const fields: Userschema<UserInterface>[] = [
  {
    field_name: "id",
    display_name: "ID",
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
  {
    field_name: "actions", // Allowing "actions" as a valid field
    display_name: "Actions",
    type: "button",
    required: false,
    buttonAction: (
      data: UserInterface,
      handleEdit: (data: UserInterface) => void,
      handleDelete: (id: number) => void
    ) => (
      <>
        <Button variant="contained" endIcon={<EditIcon />} sx={{color:'blue',bgColor:"white"}} className="edit" onClick={() => handleEdit(data)}>
          Edit
        </Button>
        <Button variant="contained" color="error" startIcon={<DeleteIcon />} className="delete" onClick={() => handleDelete(data.id)}>
          Delete
        </Button>
      </>
    ),
  },
];

const Users: React.FC = () => {
  const [view, setViewType] = useState<"list" | "add" | "edit">("list");
  const [data, setData] = useState<UserInterface[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<keyof UserInterface>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editData, setUpdateData] = useState<UserInterface>(
    defaultDataRecord()
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  const handleSort = (column: keyof UserInterface) => {
    const newSortOrder =
      sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newSortOrder);
  };

  const filteredData = useMemo(() => {
    const sortedData = [...data].sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];
      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }
      return 0;
    });

    const lowerSearchQuery = searchQuery.toLowerCase();
    return sortedData.filter((data) =>
      fields
        .filter((field) => field.field_name !== "actions") // Skip actions field
        .some((field) =>
          String(data[field.field_name as keyof UserInterface] ?? "")
            .toLowerCase()
            .includes(lowerSearchQuery)
        )
    );
  }, [data, searchQuery, sortColumn, sortOrder]);

  const handleSave = (data: UserInterface) => {
    setData((prevData) => {
      const existingDataIndex = prevData.findIndex((u) => u.id === data.id);
      if (existingDataIndex === -1) {
        return [...prevData, data];
      } else {
        return prevData.map((u) => (u.id === data.id ? data : u));
      }
    });
    setUpdateData(defaultDataRecord());
    setViewType("list");
  };

  const handleEdit = (data: UserInterface) => {
    setUpdateData(data);
    setViewType("edit");
  };

  const handleDelete = (id: number) => {
    setData((prevData) => prevData.filter((data) => data.id !== id));
  };

  const addButton = <Button variant="outlined" sx={{
    '&:hover': {
      color: 'white',
      bgColor:"blue"
    },
  }} onClick={() => setViewType("add")}> + Add User</Button>;

  return (
    <div className="container">
      {view === "list" && (
        <>
          <div>
            <h1>{moduleName}</h1>
            {data.length > 0 && (
              <div className="controls">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                {addButton}
              </div>
            )}
          </div>
          {data.length > 0 && (
            <ListComponent
              data={filteredData}
              fields={fields}
              handleSort={handleSort}
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}
          {data.length === 0 && (
            <div className="empty_message_wrap">
              <div className="empty_message">{addButton}</div>
            </div>
          )}
        </>
      )}
      {view === "add" || view === "edit" ? (
        <CustomForm
          fields={fields}
          data={editData}
          onSave={handleSave}
          onCancel={() => setViewType("list")}
        />
      ) : null}
    </div>
  );
};

export default Users;
