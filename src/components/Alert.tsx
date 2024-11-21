import React from 'react';

const Alert: React.FC = () => {
  return (
    <div className="alert alert-dark shadow mb-5" role="alert">
      <strong>
        <h4 className="alert-heading">
          <i className="bi bi-exclamation-circle"></i>&nbsp;&nbsp;NOTES !
        </h4>
      </strong>
      <p>
        YOU CAN IMPORT ROM HACKS OR MODIFICATIONS, BUT PLEASE NOTE THAT NOT ALL GAMES ARE PLAYABLE. SOMETIMES,
        THERE ARE ALSO SOME GAMES THAT CANNOT BOOT, AND NOT EVERY PLATFORM SUPPORTS ALL ROM EXTENSIONS. IF YOU
        ENCOUNTER AN ERROR WHILE LOADING GAMES, ALWAYS CHECK YOUR INTERNET CONNECTION FIRST. IF THE ERROR
        PERSISTS, I RECOMMEND USING THE GOOGLE CHROME BROWSER.
      </p>
      <p>*I am not affiliated with any developers, publishers, or anyone else. I created this project out of my
        own desire.</p>
      <p>Thank you for understanding.</p>
      <hr />
      <p className="mb-0 text-end"> - <strong>ReiivanTheOnlyOne.</strong></p>
    </div>
  );
};

export default Alert;
