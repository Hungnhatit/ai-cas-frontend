import { api } from "@/lib/axios";


export const fileService = {
  fileUploadService: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  bulkUpload: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const res = await api.post('/file/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  deleteFile: async (file_id: number) => {
    const res = await api.delete(`/file/detele/${file_id}`);
    return res.data;
  }
}