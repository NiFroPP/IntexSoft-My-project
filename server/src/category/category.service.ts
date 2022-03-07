import { Model } from 'mongoose'
import CategoryModel, { Category } from './category.model'
import CustomErrors from '../errors/API.error'

class CategoryService {
  constructor(private model: Model<Category>) {
    this.model = model
  }

  async isCandidateExist(name: string) {
    const candidate = await this.model.findOne({ name })
    if (!candidate) {
      throw CustomErrors.badRequestError(`Category '${name}' does not exist`)
    }
    return candidate
  }

  async getAllData() {
    return this.model.find()
  }

  async getAllWords() {
    return this.model.find(
      {},
      { name: 1, nameRU: 1, cards: { name: 1, nameRU: 1 } }
    )
  }

  async getAllCategoriesWithoutCards() {
    return this.model.find({}, { name: 1, nameRU: 1, image: 1 })
  }

  async getOneCategory(name: string) {
    return this.isCandidateExist(name)
  }

  async addCategory(name: string, nameRU: string, image: string) {
    const candidate = await this.model.findOne({ name })
    if (candidate) {
      throw CustomErrors.badRequestError(`Category '${name}' already exist`)
    }

    const newCategory = await this.model.create({
      name,
      nameRU,
      image,
      cards: [],
    })

    return newCategory
  }

  async updateCategory(
    name: string,
    updName: string,
    updNameRU: string,
    updImage: string
  ) {
    await this.isCandidateExist(name)
    const updCategory = await this.model.updateOne(
      { name },
      { $set: { name: updName, nameRU: updNameRU, image: updImage } }
    )

    return updCategory
  }

  async deleteCategory(name: string) {
    await this.isCandidateExist(name)
    await this.model.deleteOne({ name })
  }

  async addCard(name: string, cards: any) {
    await this.isCandidateExist(name)
    await this.model.updateOne(
      { name },
      {
        $push: {
          cards: {
            name: cards.name,
            nameRU: cards.nameRU,
            image: cards.image,
            sound: cards.sound,
          },
        },
      }
    )
  }

  async updateCard(name: string, cardName: string, updCard: any) {
    await this.isCandidateExist(name)

    await this.model.updateOne(
      { name, cards: { $elemMatch: { name: cardName } } },
      {
        $set: {
          'cards.$.name': updCard.name,
          'cards.$.nameRU': updCard.nameRU,
          'cards.$.image': updCard.image,
          'cards.$.sound': updCard.sound,
        },
      }
    )
  }

  async deleteCard(name: string, cards: any) {
    await this.isCandidateExist(name)
    await this.model.updateOne(
      { name },
      {
        $pull: { cards: { name: cards.name } },
      }
    )
  }
}

export default new CategoryService(CategoryModel)