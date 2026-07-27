import { useMemo, useState } from "react";
import {
  FiHelpCircle,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiCreditCard,
  FiRepeat,
  FiAlertTriangle,
  FiUsers,
  FiShield,
  FiHeadphones,
} from "react-icons/fi";

function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqs = [
    {
      id: 1,
      category: "Transactions",
      icon: <FiRepeat />,
      question: "How does transaction monitoring work?",
      answer:
        "FraudShield evaluates transaction information using the configured rule-based fraud detection logic. Transactions can be classified as safe, suspicious, or fraudulent.",
    },
    {
      id: 2,
      category: "Fraud Detection",
      icon: <FiShield />,
      question: "How are fraudulent transactions detected?",
      answer:
        "Transactions are evaluated against fraud detection rules. When transaction activity matches configured risk conditions, the system can classify it as suspicious or fraudulent.",
    },
    {
      id: 3,
      category: "Fraud Alerts",
      icon: <FiAlertTriangle />,
      question: "What should I do when a fraud alert appears?",
      answer:
        "Open the Fraud Alerts page and review the related transaction details. After the case has been reviewed, the alert can be marked as resolved.",
    },
    {
      id: 4,
      category: "Cards",
      icon: <FiCreditCard />,
      question: "How do I register a new card?",
      answer:
        "Open the Cards page, select Add Card, choose the associated customer, enter the required card information, and submit the form.",
    },
    {
      id: 5,
      category: "Customers",
      icon: <FiUsers />,
      question: "How do I add a new customer?",
      answer:
        "Open the Customers page and select Add Customer. Enter the customer's required information and submit the form.",
    },
    {
      id: 6,
      category: "Customer Care",
      icon: <FiHeadphones />,
      question: "How do support cases work?",
      answer:
        "Customer Care allows support cases to be created for card, transaction, fraud, account, and other issues. Cases remain open until an administrator resolves them.",
    },
  ];

  const filteredFaqs = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return faqs;
    }

    return faqs.filter((faq) => {
      return (
        faq.question.toLowerCase().includes(search) ||
        faq.answer.toLowerCase().includes(search) ||
        faq.category.toLowerCase().includes(search)
      );
    });
  }, [searchTerm]);

  const toggleQuestion = (id) => {
    setOpenQuestion((previous) =>
      previous === id ? null : id
    );
  };

  return (
    <div className="help-center-page">
      {/* HEADER */}

      <div className="help-center-header">
        <p className="help-center-eyebrow">
          FRAUDSHIELD SUPPORT
        </p>

        <h1>Help Center</h1>

        <p>
          Find answers and guidance for using the FraudShield
          fraud detection system.
        </p>
      </div>

      {/* SEARCH */}

      <div className="help-search-wrapper">
        <FiSearch />

        <input
          type="text"
          placeholder="Search help topics..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />
      </div>

      {/* QUICK HELP */}

      <div className="help-quick-grid">
        <HelpCard
          icon={<FiRepeat />}
          title="Transactions"
          text="Transaction monitoring and risk classification."
        />

        <HelpCard
          icon={<FiAlertTriangle />}
          title="Fraud Alerts"
          text="Review and resolve detected fraud alerts."
        />

        <HelpCard
          icon={<FiCreditCard />}
          title="Card Management"
          text="Manage registered customer payment cards."
        />

        <HelpCard
          icon={<FiHeadphones />}
          title="Customer Support"
          text="Manage customer complaints and support cases."
        />
      </div>

      {/* FAQ */}

      <section className="help-faq-panel">
        <div className="help-section-heading">
          <div className="help-section-icon">
            <FiHelpCircle />
          </div>

          <div>
            <h2>Frequently Asked Questions</h2>
            <p>
              Common questions about FraudShield.
            </p>
          </div>
        </div>

        <div className="help-faq-list">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div
                className={`help-faq-item ${
                  openQuestion === faq.id
                    ? "open"
                    : ""
                }`}
                key={faq.id}
              >
                <button
                  type="button"
                  className="help-faq-question"
                  onClick={() =>
                    toggleQuestion(faq.id)
                  }
                >
                  <div className="help-faq-question-left">
                    <div className="help-faq-icon">
                      {faq.icon}
                    </div>

                    <div>
                      <span>{faq.category}</span>
                      <strong>{faq.question}</strong>
                    </div>
                  </div>

                  {openQuestion === faq.id ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  )}
                </button>

                {openQuestion === faq.id && (
                  <div className="help-faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="help-no-results">
              <FiSearch />

              <strong>No help topics found</strong>

              <p>
                Try searching with a different keyword.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SYSTEM INFO */}

      <section className="help-security-note">
        <div className="help-security-icon">
          <FiShield />
        </div>

        <div>
          <strong>FraudShield Protection Center</strong>

          <p>
            Transaction monitoring, fraud alerts and support
            services are available from the navigation menu.
          </p>
        </div>
      </section>
    </div>
  );
}

function HelpCard({ icon, title, text }) {
  return (
    <div className="help-quick-card">
      <div className="help-quick-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

export default HelpCenter;