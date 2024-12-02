import { ListComponentProps } from "../types";
import "./ListComponent.css";

const ListComponent = <T extends { id: number }>({
  data,
  fields,
  handleSort,
  sortColumn,
  sortOrder,
  handleEdit,
  handleDelete,
}: ListComponentProps<T>) => {
  return (
    <div className="list-container">
      <table>
        <thead>
          <tr>
            {fields.map((field) => {
              if (field.field_name !== "actions") {
                return (
                  <th
                    key={String(field.field_name)} // Ensure we use string key here
                    onClick={() => handleSort(field.field_name as keyof T)} // Explicitly cast to keyof T
                  >
                    {field.display_name}{" "}
                    {sortColumn === field.field_name
                      ? sortOrder === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                );
              } else {
                return <th>{field.display_name}</th>;
              }
            })}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((rowData) => (
              <tr key={rowData.id}>
                {fields.map((field) => {
                  if (field.field_name !== "actions") {
                    return (
                      <td key={String(field.field_name)}>
                        {String(rowData[field.field_name])}
                      </td>
                    );
                  } else {
                    return (
                      <td key={String(field.field_name)}>
                        {field.buttonAction
                          ? field.buttonAction(
                              rowData,
                              handleEdit,
                              handleDelete
                            )
                          : null}
                      </td>
                    );
                  }
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td className="norecord" colSpan={fields.length + 1}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListComponent;
