type BusinessImages = { image_url: string } | { image_url: string }[] | null | undefined;

export function getBusinessImageUrls(images: BusinessImages) {
    return (Array.isArray(images) ? images : images ? [images] : []).map((image) => image.image_url);
}
