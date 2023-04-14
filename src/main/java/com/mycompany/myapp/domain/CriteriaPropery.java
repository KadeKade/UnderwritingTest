package com.mycompany.myapp.domain;

import java.io.Serializable;
import javax.persistence.*;

/**
 * A CriteriaPropery.
 */
@Entity
@Table(name = "criteria_propery")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CriteriaPropery implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "property_name")
    private String propertyName;

    @Column(name = "display_name_de")
    private String displayNameDe;

    @Column(name = "display_name_en")
    private String displayNameEn;

    @Column(name = "display_name_fr")
    private String displayNameFr;

    @Column(name = "display_name_it")
    private String displayNameIt;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CriteriaPropery id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPropertyName() {
        return this.propertyName;
    }

    public CriteriaPropery propertyName(String propertyName) {
        this.setPropertyName(propertyName);
        return this;
    }

    public void setPropertyName(String propertyName) {
        this.propertyName = propertyName;
    }

    public String getDisplayNameDe() {
        return this.displayNameDe;
    }

    public CriteriaPropery displayNameDe(String displayNameDe) {
        this.setDisplayNameDe(displayNameDe);
        return this;
    }

    public void setDisplayNameDe(String displayNameDe) {
        this.displayNameDe = displayNameDe;
    }

    public String getDisplayNameEn() {
        return this.displayNameEn;
    }

    public CriteriaPropery displayNameEn(String displayNameEn) {
        this.setDisplayNameEn(displayNameEn);
        return this;
    }

    public void setDisplayNameEn(String displayNameEn) {
        this.displayNameEn = displayNameEn;
    }

    public String getDisplayNameFr() {
        return this.displayNameFr;
    }

    public CriteriaPropery displayNameFr(String displayNameFr) {
        this.setDisplayNameFr(displayNameFr);
        return this;
    }

    public void setDisplayNameFr(String displayNameFr) {
        this.displayNameFr = displayNameFr;
    }

    public String getDisplayNameIt() {
        return this.displayNameIt;
    }

    public CriteriaPropery displayNameIt(String displayNameIt) {
        this.setDisplayNameIt(displayNameIt);
        return this;
    }

    public void setDisplayNameIt(String displayNameIt) {
        this.displayNameIt = displayNameIt;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CriteriaPropery)) {
            return false;
        }
        return id != null && id.equals(((CriteriaPropery) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CriteriaPropery{" +
            "id=" + getId() +
            ", propertyName='" + getPropertyName() + "'" +
            ", displayNameDe='" + getDisplayNameDe() + "'" +
            ", displayNameEn='" + getDisplayNameEn() + "'" +
            ", displayNameFr='" + getDisplayNameFr() + "'" +
            ", displayNameIt='" + getDisplayNameIt() + "'" +
            "}";
    }
}
