import type {
  VideoLessonCreateInput,
  VideoLessonFilter,
  VideoLessonUpdateInput,
  VideoLessonWithTranslations,
} from "./types";
import { VideoLessonRepository } from "./VideoLesson.repository";

export class VideoLessonService {
  private readonly repository: VideoLessonRepository;

  constructor() {
    this.repository = new VideoLessonRepository();
  }

  async getAll(
    filter?: VideoLessonFilter,
  ): Promise<VideoLessonWithTranslations[]> {
    return this.repository.findAll(filter);
  }

  async getById(id: string): Promise<VideoLessonWithTranslations> {
    const lesson = await this.repository.findById(id);
    if (!lesson) throw new Error(`VideoLesson with id ${id} not found`);
    return lesson;
  }

  async create(
    data: VideoLessonCreateInput,
  ): Promise<VideoLessonWithTranslations> {
    if (!data.sectionId) throw new Error("sectionId is required");
    if (!data.translations?.length)
      throw new Error("At least one translation is required");
    for (const t of data.translations) {
      if (!t.name?.trim())
        throw new Error(`Name is required for language: ${t.language}`);
    }
    return this.repository.create(data);
  }

  async update(
    id: string,
    data: VideoLessonUpdateInput,
  ): Promise<VideoLessonWithTranslations> {
    await this.getById(id);
    if (data.translations !== undefined) {
      if (!data.translations.length)
        throw new Error("At least one translation is required");
      for (const t of data.translations) {
        if (!t.name?.trim())
          throw new Error(`Name is required for language: ${t.language}`);
      }
    }
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<VideoLessonWithTranslations> {
    await this.getById(id);
    return this.repository.delete(id);
  }
}
