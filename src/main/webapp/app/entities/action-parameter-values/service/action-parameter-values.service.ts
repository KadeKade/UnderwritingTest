import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IActionParameterValues, NewActionParameterValues } from '../action-parameter-values.model';

export type PartialUpdateActionParameterValues = Partial<IActionParameterValues> & Pick<IActionParameterValues, 'id'>;

export type EntityResponseType = HttpResponse<IActionParameterValues>;
export type EntityArrayResponseType = HttpResponse<IActionParameterValues[]>;

@Injectable({ providedIn: 'root' })
export class ActionParameterValuesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/action-parameter-values');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(actionParameterValues: NewActionParameterValues): Observable<EntityResponseType> {
    return this.http.post<IActionParameterValues>(this.resourceUrl, actionParameterValues, { observe: 'response' });
  }

  update(actionParameterValues: IActionParameterValues): Observable<EntityResponseType> {
    return this.http.put<IActionParameterValues>(
      `${this.resourceUrl}/${this.getActionParameterValuesIdentifier(actionParameterValues)}`,
      actionParameterValues,
      { observe: 'response' }
    );
  }

  partialUpdate(actionParameterValues: PartialUpdateActionParameterValues): Observable<EntityResponseType> {
    return this.http.patch<IActionParameterValues>(
      `${this.resourceUrl}/${this.getActionParameterValuesIdentifier(actionParameterValues)}`,
      actionParameterValues,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IActionParameterValues>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IActionParameterValues[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getActionParameterValuesIdentifier(actionParameterValues: Pick<IActionParameterValues, 'id'>): number {
    return actionParameterValues.id;
  }

  compareActionParameterValues(o1: Pick<IActionParameterValues, 'id'> | null, o2: Pick<IActionParameterValues, 'id'> | null): boolean {
    return o1 && o2 ? this.getActionParameterValuesIdentifier(o1) === this.getActionParameterValuesIdentifier(o2) : o1 === o2;
  }

  addActionParameterValuesToCollectionIfMissing<Type extends Pick<IActionParameterValues, 'id'>>(
    actionParameterValuesCollection: Type[],
    ...actionParameterValuesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const actionParameterValues: Type[] = actionParameterValuesToCheck.filter(isPresent);
    if (actionParameterValues.length > 0) {
      const actionParameterValuesCollectionIdentifiers = actionParameterValuesCollection.map(
        actionParameterValuesItem => this.getActionParameterValuesIdentifier(actionParameterValuesItem)!
      );
      const actionParameterValuesToAdd = actionParameterValues.filter(actionParameterValuesItem => {
        const actionParameterValuesIdentifier = this.getActionParameterValuesIdentifier(actionParameterValuesItem);
        if (actionParameterValuesCollectionIdentifiers.includes(actionParameterValuesIdentifier)) {
          return false;
        }
        actionParameterValuesCollectionIdentifiers.push(actionParameterValuesIdentifier);
        return true;
      });
      return [...actionParameterValuesToAdd, ...actionParameterValuesCollection];
    }
    return actionParameterValuesCollection;
  }
}
