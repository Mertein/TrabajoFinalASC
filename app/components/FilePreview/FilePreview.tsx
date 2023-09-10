import Image from 'next/image';
import { useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
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
  useEffect(() => {

    if (!file.type.startsWith('video/')) {
      return;
    }
    const player = videojs(`video-${file.id}`, {
      controls: true,
      preload: 'auto'
    });

    return () => {
      // Limpiar el reproductor de video cuando el componente se desmonta
      player.dispose();
    };
  }, [file.id]);
  const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'video/mp4', 'video/x-matroska'];
  const renderPreview = () => {
    if (allowedFileTypes.includes(file.type)) {
      if (file.type.startsWith('image/')) {
        return <Image src={`/ClassesCourse/${file.name}`} alt={file.title} width={1110} height={200} />;
      } else if (file.type === 'application/pdf') {
        return (
          <iframe
            src={`/ClassesCourse/${file.name}`}
            title="PDF Preview"
            width={1110}
            height={650}
          ></iframe>
        );
      } else if (file.type.startsWith('video/')) {
        return (
          <video
            id={`video-${file.id}`}
            className="video-js vjs-default-skin"
            controls
            preload="auto"
            width={1110}
            height="auto"
            data-setup='{}'
          >
            <source src={`/ClassesCourse/${file.name}`} type="video/mp4" />
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