package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.AutomatedActionType;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A AutomatedAction.
 */
@Entity
@Table(name = "automated_action")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AutomatedAction implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private AutomatedActionType type;

    @Column(name = "positive_action_definition")
    private String positiveActionDefinition;

    @Column(name = "negative_action_definition")
    private String negativeActionDefinition;

    @Column(name = "negative_action_property_value")
    private String negativeActionPropertyValue;

    @Column(name = "display_name_de")
    private String displayNameDe;

    @Column(name = "display_name_en")
    private String displayNameEn;

    @Column(name = "display_name_fr")
    private String displayNameFr;

    @Column(name = "display_name_it")
    private String displayNameIt;

    @OneToMany(mappedBy = "automatedAction")
    @JsonIgnoreProperties(value = { "automatedAction" }, allowSetters = true)
    private Set<ActionParameter> positiveActionParameters = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AutomatedAction id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AutomatedActionType getType() {
        return this.type;
    }

    public AutomatedAction type(AutomatedActionType type) {
        this.setType(type);
        return this;
    }

    public void setType(AutomatedActionType type) {
        this.type = type;
    }

    public String getPositiveActionDefinition() {
        return this.positiveActionDefinition;
    }

    public AutomatedAction positiveActionDefinition(String positiveActionDefinition) {
        this.setPositiveActionDefinition(positiveActionDefinition);
        return this;
    }

    public void setPositiveActionDefinition(String positiveActionDefinition) {
        this.positiveActionDefinition = positiveActionDefinition;
    }

    public String getNegativeActionDefinition() {
        return this.negativeActionDefinition;
    }

    public AutomatedAction negativeActionDefinition(String negativeActionDefinition) {
        this.setNegativeActionDefinition(negativeActionDefinition);
        return this;
    }

    public void setNegativeActionDefinition(String negativeActionDefinition) {
        this.negativeActionDefinition = negativeActionDefinition;
    }

    public String getNegativeActionPropertyValue() {
        return this.negativeActionPropertyValue;
    }

    public AutomatedAction negativeActionPropertyValue(String negativeActionPropertyValue) {
        this.setNegativeActionPropertyValue(negativeActionPropertyValue);
        return this;
    }

    public void setNegativeActionPropertyValue(String negativeActionPropertyValue) {
        this.negativeActionPropertyValue = negativeActionPropertyValue;
    }

    public String getDisplayNameDe() {
        return this.displayNameDe;
    }

    public AutomatedAction displayNameDe(String displayNameDe) {
        this.setDisplayNameDe(displayNameDe);
        return this;
    }

    public void setDisplayNameDe(String displayNameDe) {
        this.displayNameDe = displayNameDe;
    }

    public String getDisplayNameEn() {
        return this.displayNameEn;
    }

    public AutomatedAction displayNameEn(String displayNameEn) {
        this.setDisplayNameEn(displayNameEn);
        return this;
    }

    public void setDisplayNameEn(String displayNameEn) {
        this.displayNameEn = displayNameEn;
    }

    public String getDisplayNameFr() {
        return this.displayNameFr;
    }

    public AutomatedAction displayNameFr(String displayNameFr) {
        this.setDisplayNameFr(displayNameFr);
        return this;
    }

    public void setDisplayNameFr(String displayNameFr) {
        this.displayNameFr = displayNameFr;
    }

    public String getDisplayNameIt() {
        return this.displayNameIt;
    }

    public AutomatedAction displayNameIt(String displayNameIt) {
        this.setDisplayNameIt(displayNameIt);
        return this;
    }

    public void setDisplayNameIt(String displayNameIt) {
        this.displayNameIt = displayNameIt;
    }

    public Set<ActionParameter> getPositiveActionParameters() {
        return this.positiveActionParameters;
    }

    public void setPositiveActionParameters(Set<ActionParameter> actionParameters) {
        if (this.positiveActionParameters != null) {
            this.positiveActionParameters.forEach(i -> i.setAutomatedAction(null));
        }
        if (actionParameters != null) {
            actionParameters.forEach(i -> i.setAutomatedAction(this));
        }
        this.positiveActionParameters = actionParameters;
    }

    public AutomatedAction positiveActionParameters(Set<ActionParameter> actionParameters) {
        this.setPositiveActionParameters(actionParameters);
        return this;
    }

    public AutomatedAction addPositiveActionParameters(ActionParameter actionParameter) {
        this.positiveActionParameters.add(actionParameter);
        actionParameter.setAutomatedAction(this);
        return this;
    }

    public AutomatedAction removePositiveActionParameters(ActionParameter actionParameter) {
        this.positiveActionParameters.remove(actionParameter);
        actionParameter.setAutomatedAction(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AutomatedAction)) {
            return false;
        }
        return id != null && id.equals(((AutomatedAction) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AutomatedAction{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", positiveActionDefinition='" + getPositiveActionDefinition() + "'" +
            ", negativeActionDefinition='" + getNegativeActionDefinition() + "'" +
            ", negativeActionPropertyValue='" + getNegativeActionPropertyValue() + "'" +
            ", displayNameDe='" + getDisplayNameDe() + "'" +
            ", displayNameEn='" + getDisplayNameEn() + "'" +
            ", displayNameFr='" + getDisplayNameFr() + "'" +
            ", displayNameIt='" + getDisplayNameIt() + "'" +
            "}";
    }
}
