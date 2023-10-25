import Image from 'next/image';
import { useEffect, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
interface Files {
  class_id: number;
  id: number;
  identifier: string;
  title: string;
  name: string;
  path: string;
  size: number;
  type: string;
}

const FilePreview = ({ file }: { file: Files }) => {
  const CDNURL = 'https://dqppsiohkcussxaivbqa.supabase.co/storage/v1/object/public/files/ClassesCourse/';
  const supabase = createClientComponentClient()
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data } = supabase
        .storage
        .from('files/ClassesCourse')
        .getPublicUrl(path)
        setAvatarUrl(data.publicUrl)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }
    if (file) downloadImage(file.name)
  }, [file, supabase])

  const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'video/mp4', 'video/x-matroska'];
  const renderPreview = () => {
    if (allowedFileTypes.includes(file.type)) {
      if (file.type.startsWith('image/')) {
        return <Image src={avatarUrl} alt={file.title} width={1110} height={200} />;
      } else if (file.type === 'application/pdf') {
        return (
          <iframe
            src={avatarUrl}
            title="PDF Preview"
            width={1110}
            height={650}
          ></iframe>
        );
      } else if (file.type.startsWith('video/')) {
        return (
          <video
            className="video-js vjs-default-skin"
            controls
            preload="auto"
            width={1110}
            height="auto"
            data-setup='{}'
          >
            <source src={CDNURL + file.name} type="video/mp4" />
          </video>
        );
      } else {
        return <p>File type not supported for preview.</p>;
      }
    } else {
      return (
        <div>
          <p>File type not allowed for preview.</p>
          <a href={file.path} download={file.name}>
            Download {file.name}
          </a>
        </div>
      );
    }
  };

  return <div className="file-preview">{renderPreview()}</div>;
};
export default FilePreview;