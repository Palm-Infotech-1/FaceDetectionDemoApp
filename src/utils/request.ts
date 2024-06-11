const baseUrl = 'http://192.168.29.157:3000';

export const uploadVideo = async (formData: FormData) => {
    return await fetch(`${baseUrl}/video`, {
        method: 'post',
        body: formData,
    }).then(res => res.json())
}