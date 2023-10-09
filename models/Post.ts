import { Schema, model } from 'mongoose';

const PostSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    image: String,
    likes: [
      {
        type: String,
        ref: 'User',
        default: [],
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Post', PostSchema);
