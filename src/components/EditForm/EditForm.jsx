import React, { useState } from 'react';

const EditForm = ({ boletin, onSave, onCancel }) => {
  const [editedBoletin, setEditedBoletin] = useState({ ...boletin });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBoletin((prevBoletin) => ({
      ...prevBoletin,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedBoletin);
  };

  return (
    <div>
      <h3>Editar Boletín</h3>
      <label>Habilita:</label>
      <input
        type="text"
        name="habilita"
        value={editedBoletin.habilita}
        onChange={handleInputChange}
      />
      <button onClick={handleSave}>Guardar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
};

export default EditForm;
