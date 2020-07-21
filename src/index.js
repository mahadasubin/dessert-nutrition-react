const { ApolloServer, gql } = require('apollo-server');
const { v4: uuidv4  } = require('uuid');

var defaultsDesserts = [
  {
    id: uuidv4(),
    dessert: "Oreo",
    nutritionInfo: {
      calories: 437,
      fat: 18,
      carb: 63,
      protein: 4,
    }
  },
  {   
    id:uuidv4(),
    dessert: "Nougat",
    nutritionInfo: {
        calories: 360,
        fat: 19,
        carb: 9,   
        protein: 37,
    }
  }
]
var desserts = defaultsDesserts;

// The GraphQL schema
const typeDefs = gql`
  type NutritionInfo {
    fat: Float
    carb: Float
    calories: Float
    protein: Float
  }
  type Dessert {
    id: ID
    dessert: String
    nutritionInfo: NutritionInfo
  }
  type Query {
    nutritionList: [Dessert]
  }
  input NutritionInfoInput {
    fat: String!
    carb: String!
    calories: String!
    protein: String!
  }
  input DessertInput {
    dessert: String!
    nutritionInfo: NutritionInfoInput!
  }
  type Mutation {
    add(input: DessertInput!): Dessert
    delete(input: [ID]!):Dessert
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    nutritionList: () => desserts
  },
  Mutation: {
    add: (_, {input}) => {
      input.id = uuidv4();
      desserts.push(input)
      return input
    },
    delete: (_, {input}) => {
      desserts = desserts.filter(d => 
        !input.includes(d.id))
      return desserts;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
