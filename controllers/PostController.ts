import { Response } from 'express';
import { AuthRequest } from '../interfaces/App.interface';
import PostSchema from '../models/Post';
import { isValidObjectId } from 'mongoose';

const getPosts = async (request: AuthRequest, response: Response) => {
  try {
    const posts = await PostSchema.find().populate('user').exec();

    response.json(posts);
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Не удалось получить посты',
    });
  }
};

const likePost = async (request: AuthRequest, response: Response) => {
  const postId = request.params.id;
  const userId = request.body.userId;

  if (!isValidObjectId(postId)) {
    return response.status(404).send('Invalid post ID');
  }

  try {
    const post = await PostSchema.findById(postId);

    if (!post) {
      return response.status(404).send('Post not found');
    }

    const likedByUser = post.likes.includes(userId);

    if (likedByUser) {
      post.likes = post.likes.filter((userId) => userId !== userId);
    } else {
      post.likes.push(userId);
    }

    const updatedPost = await post.save();
    response.json(updatedPost);
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Не удалось получить посты',
    });
  }
};

const deletePost = async (request: AuthRequest, response: Response) => {
  try {
    const postId = request.params.id;

    const updatedPosts = await PostSchema.findOneAndDelete({
      _id: postId,
    });

    if (!updatedPosts) {
      response.status(404).json({
        message: 'Пост не найден',
      });
    }
    response.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Не удалось получить пост',
    });
  }
};

const createPost = async (request: AuthRequest, response: Response) => {
  try {
    const doc = new PostSchema({
      text: request.body.text,
      image: request.body.image,
      user: request.userId,
    });

    const post = await doc.save();

    response.json(post);
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Не удалось создать пост',
    });
  }
};

export { getPosts, createPost, likePost, deletePost };
