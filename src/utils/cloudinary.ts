const CLOUD_NAME = "dslkfolxy";
const UPLOAD_PRESET = "sleekstamp_unsigned";

/**
 * Upload a file to Cloudinary using the unsigned upload preset.
 * Returns the secure URL of the uploaded file.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "sleekstamp-logos");

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
    );

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Cloudinary upload failed:", err);
        throw new Error("Failed to upload your logo. Please try again.");
    }

    const data = await res.json();
    return data.secure_url as string;
}
