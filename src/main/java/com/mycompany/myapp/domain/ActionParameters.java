package com.mycompany.myapp.domain;

import java.io.Serializable;
import javax.persistence.*;

/**
 * A ActionParameters.
 */
@Entity
@Table(name = "action_parameters")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ActionParameters implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "parameter_name")
    private String parameterName;

    @Column(name = "display_name_de")
    private String displayNameDe;

    @Column(name = "display_name_en")
    private String displayNameEn;

    @Column(name = "display_name_fr")
    private String displayNameFr;

    @Column(name = "display_name_it")
    private String displayNameIt;

    @ManyToOne
    private Action action;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ActionParameters id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getParameterName() {
        return this.parameterName;
    }

    public ActionParameters parameterName(String parameterName) {
        this.setParameterName(parameterName);
        return this;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }

    public String getDisplayNameDe() {
        return this.displayNameDe;
    }

    public ActionParameters displayNameDe(String displayNameDe) {
        this.setDisplayNameDe(displayNameDe);
        return this;
    }

    public void setDisplayNameDe(String displayNameDe) {
        this.displayNameDe = displayNameDe;
    }

    public String getDisplayNameEn() {
        return this.displayNameEn;
    }

    public ActionParameters displayNameEn(String displayNameEn) {
        this.setDisplayNameEn(displayNameEn);
        return this;
    }

    public void setDisplayNameEn(String displayNameEn) {
        this.displayNameEn = displayNameEn;
    }

    public String getDisplayNameFr() {
        return this.displayNameFr;
    }

    public ActionParameters displayNameFr(String displayNameFr) {
        this.setDisplayNameFr(displayNameFr);
        return this;
    }

    public void setDisplayNameFr(String displayNameFr) {
        this.displayNameFr = displayNameFr;
    }

    public String getDisplayNameIt() {
        return this.displayNameIt;
    }

    public ActionParameters displayNameIt(String displayNameIt) {
        this.setDisplayNameIt(displayNameIt);
        return this;
    }

    public void setDisplayNameIt(String displayNameIt) {
        this.displayNameIt = displayNameIt;
    }

    public Action getAction() {
        return this.action;
    }

    public void setAction(Action action) {
        this.action = action;
    }

    public ActionParameters action(Action action) {
        this.setAction(action);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ActionParameters)) {
            return false;
        }
        return id != null && id.equals(((ActionParameters) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ActionParameters{" +
            "id=" + getId() +
            ", parameterName='" + getParameterName() + "'" +
            ", displayNameDe='" + getDisplayNameDe() + "'" +
            ", displayNameEn='" + getDisplayNameEn() + "'" +
            ", displayNameFr='" + getDisplayNameFr() + "'" +
            ", displayNameIt='" + getDisplayNameIt() + "'" +
            "}";
    }
}
