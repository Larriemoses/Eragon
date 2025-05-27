import React from "react";

// Define the props interface for ProductFooter
interface ProductFooterProps {
  effortlessSavingsTitle?: string;
  effortlessSavingsDescription?: string;
  howToUseTitle?: string;
  howToUseSteps?: string[];
  howToUseNote?: string;
  tipsTitle?: string;
  tipsList?: string[];
  contactTitle?: string;
  contactDescription?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactWhatsapp?: string;
}

const ProductFooter: React.FC<ProductFooterProps> = ({
  effortlessSavingsTitle,
  effortlessSavingsDescription,
  howToUseTitle,
  howToUseSteps,
  howToUseNote,
  tipsTitle,
  tipsList,
  contactTitle,
  contactDescription,
  contactPhone,
  contactEmail,
  contactWhatsapp,
}) => (
  <div className="w-full max-w-2xl mx-auto px-4 py-10 text-gray-800 mt-10">
    {/* Effortless Savings */}
    {effortlessSavingsTitle && effortlessSavingsDescription && (
      <section className="mb-8">
        <h2 className="text-xl font-bold text-center mb-2">
          {effortlessSavingsTitle.split('<br />').map((line, index) => (
              <React.Fragment key={index}>
                  {line}
                  {index < effortlessSavingsTitle.split('<br />').length - 1 && <br />}
              </React.Fragment>
          ))}
        </h2>
        <p className="text-center text-sm md:text-base">
          {effortlessSavingsDescription}
        </p>
      </section>
    )}

    {/* How to Use */}
    {howToUseTitle && howToUseSteps && howToUseSteps.length > 0 && (
      <section className="mb-8">
        <h3 className="text-lg font-bold mb-2 text-center">
          {howToUseTitle.split('<br />').map((line, index) => (
              <React.Fragment key={index}>
                  {line}
                  {index < howToUseTitle.split('<br />').length - 1 && <br />}
              </React.Fragment>
          ))}
        </h3>
        <ol className="list-decimal pl-6 space-y-1 text-sm md:text-base">
          {howToUseSteps.map((step, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: step }}></li>
          ))}
        </ol>
        {howToUseNote && (
          <p className="text-xs text-gray-600 mt-2">
            <span className="font-bold">NOTE:</span> {howToUseNote}
          </p>
        )}
      </section>
    )}

    {/* Tips */}
    {tipsTitle && tipsList && tipsList.length > 0 && (
      <section className="mb-8">
        <h3 className="text-lg font-bold mb-2 text-center">
          {tipsTitle.split('<br />').map((line, index) => (
              <React.Fragment key={index}>
                  {line}
                  {index < tipsTitle.split('<br />').length - 1 && <br />}
              </React.Fragment>
          ))}
        </h3>
        <ul className="list-disc pl-6 space-y-1 text-sm md:text-base">
          {tipsList.map((tip, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: tip }}></li>
          ))}
        </ul>
      </section>
    )}

    {/* Contact */}
    {(contactTitle || contactDescription || contactPhone || contactEmail || contactWhatsapp) && (
      <section>
        {contactTitle && (
          <h3 className="text-lg font-bold mb-2 text-center">
            {contactTitle.split('<br />').map((line, index) => (
                <React.Fragment key={index}>
                    {line}
                    {index < contactTitle.split('<br />').length - 1 && <br />}
                </React.Fragment>
            ))}
          </h3>
        )}
        {contactDescription && (
          <p className="text-center text-sm md:text-base mb-4">
            {contactDescription}
          </p>
        )}
        {(contactPhone || contactEmail || contactWhatsapp) && (
          <div className="flex flex-col md:flex-row justify-center gap-6 bg-gray-100 rounded-xl p-6 text-center">
            {contactPhone && (
              <div className="flex-1">
                <div className="font-semibold mb-1">Phone Support</div>
                <div className="text-sm">{contactPhone}</div>
              </div>
            )}
            {contactEmail && (
              <div className="flex-1">
                <div className="font-semibold mb-1">Email Support</div>
                <div className="text-sm">{contactEmail}</div>
              </div>
            )}
            {contactWhatsapp && (
              <div className="flex-1">
                <div className="font-semibold mb-1">Whatsapp Support</div>
                <div className="text-sm">{contactWhatsapp}</div>
              </div>
            )}
          </div>
        )}
      </section>
    )}
  </div>
);

export default ProductFooter;