import { Schema, model, Document } from 'mongoose'

export interface Category extends Document {
  name: string
  nameRU: string
  image: string
  cards: [
    {
      name: string
      nameRU: string
      image: string
      sound: string
    }
  ]
}

const schema = new Schema<Category>({
  name: { type: String, unique: true, require: true },
  nameRU: { type: String, require: true },
  image: { type: String, require: true },
  cards: [
    {
      name: { type: String, require: true },
      nameRU: { type: String, require: true },
      image: { type: String, require: true },
      sound: { type: String, require: true },
    },
  ],
})

const CategoryModel = model<Category>('Category', schema)

export default CategoryModel