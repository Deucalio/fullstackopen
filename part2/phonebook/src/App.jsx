import { useState, useEffect } from "react";
import axios from "axios";

const SearchBar = ({ filterText, setFilterText }) => {
  return (
    <form>
      <div>
        filter shown with{" "}
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
    </form>
  );
};

const PersonForm = ({ handleChange, newPerson, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name:{" "}
        <input
          name="name"
          value={newPerson.name}
          type="text"
          onChange={handleChange}
        />
      </div>
      <div>
        number:{" "}
        <input
          name="number"
          value={newPerson.number}
          type="text"
          onChange={handleChange}
        />
      </div>
      <button type="submit">add</button>
    </form>
  );
};

const Person = ({ persons, filterText }) => {
  const filteredPeople = persons.map((person, i) => {
    // if filterText is not person's name
    if (person.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    }
    return (
      <p key={i}>
        {person.name} {person.number}
      </p>
    );
  });

  return <>{filteredPeople}</>;
};

const App = () => {
  const [persons, setPersons] = useState("");
  const [newPerson, setNewPerson] = useState({ name: "", number: "" });
  const [filterText, setFilterText] = useState("");

  const baseUrl = `http://localhost:3000`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPerson({ ...newPerson, [name]: value });
  };

  const isValidNumber = numberStr => /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(numberStr)

  const updatePerson = async (id) => {
    const res = await axios.put(`${baseUrl}/api/${id}`, newPerson);
    const updatedPerson = res.data;
    const personsUpdated = persons.map((p) => {
      if (p._id === updatedPerson._id) {
        p = updatedPerson;
        return p;
      } else {
        return p;
      }
    });
    setPersons(personsUpdated);
    setNewPerson({ name: "", number: "" });
  };

  useEffect(() => {
    let ignore = false;
    const callApi = async () => {
      const res = await axios.get(`${baseUrl}/api/persons`);
      if (!ignore) {
        setPersons(res.data);
      }
    };
    callApi();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPerson.name === "" || newPerson.number === "") {
      return alert("Invalid input");
    }
    if (newPerson.name.trim().length < 3) {
      return alert(
        "validation failed! name is shorter than minimun allowed length (3)"
      );
    }
    if (newPerson.number.length < 8 || !(isValidNumber(newPerson.number)) ){
      return alert("incorrect Number format")
    }

    // check if the name already exists
    const userExists =
      persons.filter((person) => person.name === newPerson.name).length === 0
        ? false
        : true;
    if (userExists) {
      // change his phone number by making http put request to the backend
      return updatePerson(
        persons.filter((p) => p.name === newPerson.name)[0]._id
      );

      // return alert(`${newPerson.name} is already added to phonebook`);
    }

    const res = await axios.post(`${baseUrl}/api/persons`, newPerson);
    setPersons([...persons, { ...newPerson, _id: res.data._id }]);
    console.log("res", res.data);
    setNewPerson({ name: "", number: "" });
  };

  if (persons === "") {
    return <p>Loading</p>;
  }

  return (
    <>
      <div>
        <h2>Phonebook</h2>

        <SearchBar filterText={filterText} setFilterText={setFilterText} />

        <legend>
          <h2>Add a new</h2>
        </legend>
        <PersonForm
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          newPerson={newPerson}
        />

        <h2>Numbers</h2>
        <Person persons={persons} filterText={filterText} />
      </div>
    </>
  );
};

export default App;
