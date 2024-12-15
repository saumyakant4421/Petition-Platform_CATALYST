const {Schema, model} = require("mongoose");

const PetitionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // URL to the image
    category: {
      type: [String],
      enum: [
        "Environment",
        "Economic Justice",
        "Women's Rights",
        "Education",
        "Disability",
        "Sports",
        "Entertainment and Media",
        "Digital Rights",
      ],
      required: true,
      validate: {
        validator: (v) => v.length > 0, // At least one category required
        message: "At least one category must be selected.",
      },
    },
    scope: {
      type: String,
      enum: ["Local", "Global", "National"],
      required: true,
    },
    authors: [{ type: String, required: true }], // Array of author names
    targetEntities: [{ type: String, required: true }], // Renamed field
    supporters: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "account" },
        signedAt: { type: Date, default: Date.now },
      },
    ],
    createdAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  });
  
//   const Petition = model("Petition", PetitionSchema);
//   module.exports = Petition;
   

  const AccountSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    signedPetitions: [{ type: Schema.Types.ObjectId, ref: "Petition" }], // Array of references to petitions
  });
  
  const Account = model("Account", AccountSchema);
  module.exports = Account;
  