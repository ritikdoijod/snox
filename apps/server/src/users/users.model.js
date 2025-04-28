import mongoose from "mongoose";
import { hash, verify } from "argon2";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      select: true,
    },
    profilePicture: {
      type: String,
      default: null,
    }
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function(next) {
  if (this.isModified("password") && this.password)
    this.password = await hash(this.password);

  next();
});

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.methods.verifyPassword = async function(value) {
  return await verify(this.password, value);
};

const User = mongoose.model("User", userSchema);

export { User };
