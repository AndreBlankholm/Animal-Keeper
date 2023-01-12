const fs = require("fs");
const {
  filterByQuery,
  findById,
  createNewZookeeper,
  validateZookeeper,
} = require("../lib/zookeepers.js");

const { zookeepers } = require("../data/zookeepers");

jest.mock('fs');

test('create an zookeeper object', () => {
    const zookeeper = createNewZookeeper({name: 'name testing', id: 'id testing'},
    zookeepers
    );
    expect(zookeeper.name).toBe('name testing');
    expect(zookeeper.id).toBe('id testing');
});

test('filters by query', () => {
    const startingZookeepers = [
        {
            id: "2",
            name: "Raksha",
            age: 31,
            favoriteAnimal: "penguin",
          },
          {
            id: "3",
            name: "Isabella",
            age: 67,
            favoriteAnimal: "bear",
          },
    ];

    const updatedZookeepers = filterByQuery({age: 31}, startingZookeepers);

    expect(updatedZookeepers.length).toEqual(1);
});


test('finds by id', () => {
  const  startingZookeepers  = [
        {
            id: "2",
            name: "Dre",
            age: 31,
            favoriteAnimal: "penguin",
          },
          {
            id: "3",
            name: "Isabella",
            age: 67,
            favoriteAnimal: "bear",
          },
        ];

    const result = findById("2", startingZookeepers);

    expect(result.name).toBe("Dre");
    
});

test("validates age", () => {
    const zookeeper = {
      id: "2",
      name: "Raksha",
      age: 31,
      favoriteAnimal: "penguin",
    };
  
    const invalidZookeeper = {
      id: "3",
      name: "Isabella",
      age: "67",
      favoriteAnimal: "bear",
    };
  
    const result = validateZookeeper(zookeeper);
    const result2 = validateZookeeper(invalidZookeeper);
  
    expect(result).toBe(true);
    expect(result2).toBe(false);
  });
